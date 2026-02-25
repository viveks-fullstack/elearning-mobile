import UserClass from '../user/userClass.model.js'
import UserCourse from '../user/userCourse.model.js'
import Course from './course.model.js'
import { success, successWithPagination } from '../../utils/response.js'
import { NotFoundError } from '../../utils/customErrors.js'
import { PAGINATION } from '../../utils/constants.js'
import { logger } from '../../utils/logger.js'

// Course Controllers
export const createCourse = async (req, reply) => {
    const data = await Course.create(req.body)
    logger.info(`Course created: ${data._id}`)
    return success(reply, data, 'Course created successfully', 201)
}

export const getCourses = async (req, reply) => {
    const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE
    const limit = Math.min(parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT)
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
        Course.find({ isActive: true })
            .populate('teacher', 'name email')
            .skip(skip)
            .limit(limit)
            .sort('-createdAt'),
        Course.countDocuments({ isActive: true })
    ])

    return successWithPagination(reply, data, { page, limit, total }, 'Courses fetched successfully')
}

export const getCourseById = async (req, reply) => {
    const data = await Course.findById(req.params.id).populate('teacher', 'name email')
    if (!data) {
        throw new NotFoundError('Course', req.params.id)
    }
    return success(reply, data, 'Course fetched successfully', 200)
}

export const updateCourse = async (req, reply) => {
    const data = await Course.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    )
    if (!data) {
        throw new NotFoundError('Course', req.params.id)
    }
    logger.info(`Course updated: ${data._id}`)
    return success(reply, data, 'Course updated successfully', 200)
}

export const deleteCourse = async (req, reply) => {
    const data = await Course.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
    )
    if (!data) {
        throw new NotFoundError('Course', req.params.id)
    }
    logger.info(`Course deleted: ${data._id}`)
    return success(reply, data, 'Course deleted successfully', 200)
}

// UserCourse Controllers
export const enrollStudentInCourse = async (req, reply) => {
    const { userId, courseId } = req.body
    // Currently allows only one active course per student
    // To enable multiple courses in the future, pass true as third parameter:
    // await UserCourse.enrollStudent(userId, courseId, true)
    const data = await UserCourse.enrollStudent(userId, courseId)
    return success(reply, data, 'Student enrolled in course successfully', 201)
}

export const getStudentCourses = async (req, reply) => {
    const data = await UserCourse.getStudentCourses(req.params.userId)
    return success(reply, data, 'Student courses fetched successfully', 200)
}

export const getCourseStudents = async (req, reply) => {
    const data = await UserCourse.getCourseStudents(req.params.courseId)
    return success(reply, data, 'Course students fetched successfully', 200)
}

export const updateCourseProgress = async (req, reply) => {
    const { userId, courseId, progress } = req.body
    const data = await UserCourse.updateProgress(userId, courseId, progress)
    return success(reply, data, 'Course progress updated successfully', 200)
}

export const unenrollStudentFromCourse = async (req, reply) => {
    const { userId, courseId } = req.params
    const data = await UserCourse.findOneAndUpdate(
        { user: userId, course: courseId },
        { status: 'dropped' },
        { new: true }
    )
    if (!data) {
        throw new NotFoundError('Enrollment')
    }
    logger.info(`Student ${userId} unenrolled from course ${courseId}`)
    return success(reply, data, 'Student unenrolled from course successfully', 200)
}

export const getCoursesByTeacher = async (req, reply) => {
    const data = await Course.find({ teacher: req.params.teacherId, isActive: true }).populate('teacher')
    return success(reply, data, 'Teacher courses fetched successfully', 200)
}

export const assignTeacherToCourses = async (req, reply) => {
    const { teacherId, courseIds } = req.body

    // Remove teacher from all their current courses
    await Course.updateMany(
        { teacher: teacherId },
        { $unset: { teacher: "" } }
    )

    // Assign teacher to new courses
    if (courseIds && courseIds.length > 0) {
        await Course.updateMany(
            { _id: { $in: courseIds } },
            { $set: { teacher: teacherId } }
        )
    }

    logger.info(`Courses assigned to teacher: ${teacherId}`)
    const data = await Course.find({ teacher: teacherId, isActive: true }).populate('teacher')
    return success(reply, data, 'Courses assigned to teacher successfully', 200)
}
