/**
 * Application Constants
 * Centralized constants for better maintainability
 */

export const USER_ROLES = {
    ADMIN: 'admin',
    TEACHER: 'teacher',
    STUDENT: 'student'
}

export const COURSE_LEVELS = {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced'
}

export const ATTENDANCE_STATUS = {
    PRESENT: 'present',
    ABSENT: 'absent',
    LATE: 'late',
    EXCUSED: 'excused'
}

export const ENROLLMENT_STATUS = {
    ACTIVE: 'active',
    COMPLETED: 'completed',
    DROPPED: 'dropped'
}

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
}

export const DATE_FORMATS = {
    ISO: 'YYYY-MM-DD',
    FULL: 'YYYY-MM-DD HH:mm:ss'
}

export const PASSWORD_MIN_LENGTH = 6
export const BCRYPT_ROUNDS = 10
export const MEETING_LINK_TOKEN_BYTES = 32
