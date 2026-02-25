import mongoose from 'mongoose'

/**
 * Attendance Model - Track student attendance for classes
 * 
 * Supports:
 * - Daily attendance marking
 * - Multiple statuses (present, absent, late, excused)
 * - Notes/remarks for each attendance record
 * - Bulk attendance marking
 */

const schema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },

        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            required: true,
            index: true
        },

        date: {
            type: Date,
            required: true,
            index: true
        },

        status: {
            type: String,
            enum: ['present', 'absent', 'late', 'excused'],
            required: true,
            default: 'absent'
        },

        markedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        remarks: {
            type: String,
            trim: true,
            default: null
        },

        checkInTime: {
            type: Date,
            default: null
        }
    },
    { timestamps: true }
)

// Compound index to ensure one attendance record per student per class per day
schema.index({ student: 1, class: 1, date: 1 }, { unique: true })

// Static methods
schema.statics.markAttendance = async function (studentId, classId, date, status, markedBy, remarks = null) {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const attendance = await this.findOneAndUpdate(
        {
            student: studentId,
            class: classId,
            date: { $gte: startOfDay, $lte: endOfDay }
        },
        {
            status,
            markedBy,
            remarks,
            checkInTime: status === 'present' || status === 'late' ? new Date() : null
        },
        {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        }
    )

    return attendance
}

schema.statics.bulkMarkAttendance = async function (attendanceRecords, markedBy) {
    const operations = attendanceRecords.map(record => {
        const startOfDay = new Date(record.date)
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date(record.date)
        endOfDay.setHours(23, 59, 59, 999)

        return {
            updateOne: {
                filter: {
                    student: record.studentId,
                    class: record.classId,
                    date: { $gte: startOfDay, $lte: endOfDay }
                },
                update: {
                    $set: {
                        status: record.status,
                        markedBy,
                        remarks: record.remarks || null,
                        checkInTime: record.status === 'present' || record.status === 'late' ? new Date() : null
                    },
                    $setOnInsert: {
                        student: record.studentId,
                        class: record.classId,
                        date: startOfDay
                    }
                },
                upsert: true
            }
        }
    })

    return this.bulkWrite(operations)
}

schema.statics.getClassAttendance = function (classId, date) {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    return this.find({
        class: classId,
        date: { $gte: startOfDay, $lte: endOfDay }
    }).populate('student', 'name email phone')
}

schema.statics.getStudentAttendance = function (studentId, startDate, endDate) {
    return this.find({
        student: studentId,
        date: { $gte: startDate, $lte: endDate }
    }).populate('class', 'title').sort('date')
}

schema.statics.getAttendanceStats = async function (studentId, classId) {
    const stats = await this.aggregate([
        {
            $match: {
                student: new mongoose.Types.ObjectId(studentId),
                class: new mongoose.Types.ObjectId(classId)
            }
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ])

    const total = stats.reduce((sum, item) => sum + item.count, 0)
    const present = stats.find(s => s._id === 'present')?.count || 0
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0

    return {
        stats,
        total,
        present,
        percentage
    }
}

export default mongoose.model('Attendance', schema)
