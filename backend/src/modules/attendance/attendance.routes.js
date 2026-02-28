import {
    markAttendance,
    bulkMarkAttendance,
    getClassAttendance,
    getStudentAttendance,
    getAttendanceStats,
    updateAttendance,
    deleteAttendance,
    getAttendanceReport,
    recordLogout,
    getUserLoginAttendance
} from './attendance.controller.js'

import {
    markAttendanceSchema,
    bulkMarkAttendanceSchema,
    updateAttendanceSchema
} from './attendance.validation.js'

import { validate } from '../../utils/validate.js'
import { roleGuard } from '../../plugins/roleGuard.js'

export default async function (app) {
    // Mark attendance
    app.post(
        '/mark',
        { preHandler: [roleGuard(['admin', 'teacher']), validate(markAttendanceSchema)] },
        markAttendance
    )

    // Bulk mark attendance
    app.post(
        '/bulk-mark',
        { preHandler: [roleGuard(['admin', 'teacher']), validate(bulkMarkAttendanceSchema)] },
        bulkMarkAttendance
    )

    // Get class attendance for a specific date
    app.get(
        '/class',
        { preHandler: roleGuard(['admin', 'teacher']) },
        getClassAttendance
    )

    // Get student attendance in date range
    app.get(
        '/student/:studentId',
        { preHandler: roleGuard(['admin', 'teacher', 'student']) },
        getStudentAttendance
    )

    // Get attendance statistics for a student in a class
    app.get(
        '/stats/:studentId/:classId',
        { preHandler: roleGuard(['admin', 'teacher']) },
        getAttendanceStats
    )

    // Get attendance report for a class
    app.get(
        '/report/:classId',
        { preHandler: roleGuard(['admin', 'teacher']) },
        getAttendanceReport
    )

    // Update attendance record
    app.put(
        '/:id',
        { preHandler: [roleGuard(['admin', 'teacher']), validate(updateAttendanceSchema)] },
        updateAttendance
    )

    // Delete attendance record
    app.delete(
        '/:id',
        { preHandler: roleGuard(['admin']) },
        deleteAttendance
    )

    // Record user logout
    app.post(
        '/logout',
        { preHandler: roleGuard(['admin', 'teacher', 'student']) },
        recordLogout
    )

    // Get user login attendance history
    app.get(
        '/login-history',
        { preHandler: roleGuard(['admin', 'teacher', 'student']) },
        getUserLoginAttendance
    )
}
