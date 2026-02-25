import * as yup from 'yup'

export const markAttendanceSchema = yup.object({
    studentId: yup.string().required('Student ID is required'),
    classId: yup.string().required('Class ID is required'),
    date: yup.date().required('Date is required'),
    status: yup.string().oneOf(['present', 'absent', 'late', 'excused']).required('Status is required'),
    remarks: yup.string()
})

export const bulkMarkAttendanceSchema = yup.object({
    attendanceRecords: yup.array().of(
        yup.object({
            studentId: yup.string().required(),
            classId: yup.string().required(),
            date: yup.date().required(),
            status: yup.string().oneOf(['present', 'absent', 'late', 'excused']).required(),
            remarks: yup.string()
        })
    ).required().min(1, 'At least one attendance record is required')
})

export const updateAttendanceSchema = yup.object({
    status: yup.string().oneOf(['present', 'absent', 'late', 'excused']),
    remarks: yup.string()
})
