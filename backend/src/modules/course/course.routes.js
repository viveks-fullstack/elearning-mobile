import {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    enrollStudentInCourse,
    getStudentCourses,
    getCourseStudents,
    updateCourseProgress,
    unenrollStudentFromCourse,
    getCoursesByTeacher,
    assignTeacherToCourses
} from './course.controller.js'
import {
    createCourseSchema,
    updateCourseSchema,
    enrollCourseSchema,
    updateProgressSchema
} from './course.validation.js'
import { validate } from '../../utils/validate.js'
import { roleGuard } from '../../plugins/roleGuard.js'

export default async function (app) {
    // Course CRUD
    app.post(
        '/',
        { preHandler: [roleGuard(['admin', 'teacher']), validate(createCourseSchema)] },
        createCourse
    )

    app.get(
        '/',
        { preHandler: roleGuard(['admin', 'teacher', 'student']) },
        getCourses
    )

    app.get(
        '/:id',
        { preHandler: roleGuard(['admin', 'teacher', 'student']) },
        getCourseById
    )

    app.put(
        '/:id',
        { preHandler: [roleGuard(['admin', 'teacher']), validate(updateCourseSchema)] },
        updateCourse
    )

    app.delete(
        '/:id',
        { preHandler: roleGuard(['admin']) },
        deleteCourse
    )

    // Enrollment Management
    app.post(
        '/enroll',
        { preHandler: [roleGuard(['admin', 'teacher']), validate(enrollCourseSchema)] },
        enrollStudentInCourse
    )

    app.get(
        '/student/:userId',
        { preHandler: roleGuard(['admin', 'teacher', 'student']) },
        getStudentCourses
    )

    app.get(
        '/:courseId/students',
        { preHandler: roleGuard(['admin', 'teacher']) },
        getCourseStudents
    )

    app.put(
        '/progress',
        { preHandler: [roleGuard(['admin', 'teacher', 'student']), validate(updateProgressSchema)] },
        updateCourseProgress
    )

    app.delete(
        '/unenroll/:userId/:courseId',
        { preHandler: roleGuard(['admin', 'teacher']) },
        unenrollStudentFromCourse
    )

    // Teacher assignments
    app.get(
        '/teacher/:teacherId',
        { preHandler: roleGuard(['admin', 'teacher']) },
        getCoursesByTeacher
    )

    app.post(
        '/assign-teacher',
        { preHandler: roleGuard(['admin']) },
        assignTeacherToCourses
    )
}