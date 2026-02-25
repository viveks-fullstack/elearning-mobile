/**
 * API Constants
 * Centralized API endpoint definitions
 */

const API_BASE = ''

export const API_ENDPOINTS = {
    // Auth
    LOGIN: `${API_BASE}/auth/login`,
    LOGOUT: `${API_BASE}/auth/logout`,
    REFRESH_TOKEN: `${API_BASE}/auth/refresh`,

    // Users
    USERS: `${API_BASE}/users`,
    STUDENTS: `${API_BASE}/users/students`,
    STUDENT: (id) => `${API_BASE}/users/student/${id}`,
    TEACHERS: `${API_BASE}/users/teachers`,
    TEACHER: (id) => `${API_BASE}/users/teacher/${id}`,

    // Classes
    CLASSES: `${API_BASE}/classes`,
    CLASS: (id) => `${API_BASE}/classes/${id}`,
    CLASS_TEACHER: (teacherId) => `${API_BASE}/classes/teacher/${teacherId}`,
    ASSIGN_TEACHER_CLASS: `${API_BASE}/classes/assign-teacher`,
    REGENERATE_LINK: (id) => `${API_BASE}/classes/${id}/regenerate-link`,

    // Courses
    COURSES: `${API_BASE}/courses`,
    COURSE: (id) => `${API_BASE}/courses/${id}`,
    COURSE_TEACHER: (teacherId) => `${API_BASE}/courses/teacher/${teacherId}`,
    ASSIGN_TEACHER_COURSE: `${API_BASE}/courses/assign-teacher`,

    // Enrollment
    ENROLL_CLASS: `${API_BASE}/classes/enroll`,
    ENROLL_COURSE: `${API_BASE}/courses/enroll`,
    STUDENT_CLASSES: (userId) => `${API_BASE}/classes/student/${userId}`,
    STUDENT_COURSES: (userId) => `${API_BASE}/courses/student/${userId}`,

    // Attendance
    ATTENDANCE: `${API_BASE}/attendance`,
    ATTENDANCE_MARK: `${API_BASE}/attendance/mark`,
    ATTENDANCE_BULK: `${API_BASE}/attendance/bulk`,
    ATTENDANCE_STUDENT: (studentId) => `${API_BASE}/attendance/student/${studentId}`,
    ATTENDANCE_CLASS: (classId) => `${API_BASE}/attendance/class/${classId}`,
}

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    SERVER_ERROR: 500
}

export const QUERY_KEYS = {
    STUDENTS: 'students',
    STUDENT: 'student',
    TEACHERS: 'teachers',
    TEACHER: 'teacher',
    CLASSES: 'classes',
    CLASS: 'class',
    COURSES: 'courses',
    COURSE: 'course',
    TEACHER_CLASSES: 'teacherClasses',
    TEACHER_COURSES: 'teacherCourses',
    ATTENDANCE: 'attendance'
}
