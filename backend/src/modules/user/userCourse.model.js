import mongoose from 'mongoose'

/**
 * UserCourse Model - Junction table for User-Course relationships
 * 
 * Current Behavior: One active course per student
 * Future Scalability: Set allowMultiple=true in enrollStudent() to enable multiple courses
 * 
 * The model is designed to support multiple course enrollments.
 * The unique compound index prevents duplicate enrollments in the same course.
 */

const schema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
            index: true
        },

        enrolledAt: {
            type: Date,
            default: Date.now
        },

        completedAt: {
            type: Date,
            default: null
        },

        status: {
            type: String,
            enum: ['enrolled', 'in-progress', 'completed', 'dropped'],
            default: 'enrolled'
        },

        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },

        grade: {
            type: String,
            enum: ['A', 'B', 'C', 'D', 'F', null],
            default: null
        },

        score: {
            type: Number,
            default: null,
            min: 0,
            max: 100
        }
    },
    { timestamps: true }
)

// Compound index to ensure a user can only enroll in a course once
schema.index({ user: 1, course: 1 }, { unique: true })

// Static methods
schema.statics.enrollStudent = async function (userId, courseId, allowMultiple = false) {
    // Check if already enrolled in this course
    const existing = await this.findOne({ user: userId, course: courseId })
    if (existing) {
        const err = new Error('Student already enrolled in this course')
        err.statusCode = 409
        throw err
    }

    // Check if student has an active course enrollment (one course at a time for now)
    if (!allowMultiple) {
        const activeCourse = await this.findOne({
            user: userId,
            status: { $in: ['enrolled', 'in-progress'] }
        })
        if (activeCourse) {
            const err = new Error('Student already enrolled in an active course. Complete or drop the current course first.')
            err.statusCode = 409
            throw err
        }
    }

    return this.create({ user: userId, course: courseId, status: 'enrolled' })
}

schema.statics.getStudentCourses = function (userId) {
    return this.find({ user: userId })
        .populate('course')
        .sort('-enrolledAt')
}

schema.statics.getCourseStudents = function (courseId) {
    return this.find({ course: courseId })
        .populate('user')
        .sort('-enrolledAt')
}

schema.statics.updateProgress = async function (userId, courseId, progress) {
    const enrollment = await this.findOne({ user: userId, course: courseId })
    if (!enrollment) {
        const err = new Error('Enrollment not found')
        err.statusCode = 404
        throw err
    }

    enrollment.progress = progress
    if (progress === 100 && !enrollment.completedAt) {
        enrollment.completedAt = new Date()
        enrollment.status = 'completed'
    }

    return enrollment.save()
}

export default mongoose.model('UserCourse', schema)
