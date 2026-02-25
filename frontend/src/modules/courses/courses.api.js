/**
 * Courses API
 * API functions for course management
 */

import api from '../../app/axios'
import { API_ENDPOINTS } from '../../utils/constants'

export const fetchCourses = async (params = {}) => {
    const { page = 1, limit = 10 } = params
    const res = await api.get(API_ENDPOINTS.COURSES, {
        params: { page, limit }
    })
    return {
        data: res.data.data,
        pagination: res.data.pagination
    }
}

export const fetchCourseById = async (id) => {
    const res = await api.get(API_ENDPOINTS.COURSE(id))
    return res.data.data
}

export const addCourse = async (courseData) => {
    const res = await api.post(API_ENDPOINTS.COURSES, courseData)
    return res.data.data
}

export const updateCourse = async ({ id, courseData }) => {
    const res = await api.put(API_ENDPOINTS.COURSE(id), courseData)
    return res.data.data
}

export const deleteCourse = async (id) => {
    const res = await api.delete(API_ENDPOINTS.COURSE(id))
    return res.data.data
}

// Enrollment APIs
export const enrollStudent = async (enrollmentData) => {
    const res = await api.post(API_ENDPOINTS.ENROLL_COURSE, enrollmentData)
    return res.data.data
}

export const fetchStudentCourses = async (userId) => {
    const res = await api.get(API_ENDPOINTS.STUDENT_COURSES(userId))
    return res.data.data
}

export const fetchCourseStudents = async (courseId) => {
    const res = await api.get(`/api/courses/course/${courseId}`)
    return res.data.data
}

export const updateCourseProgress = async (progressData) => {
    const res = await api.put('/api/courses/progress', progressData)
    return res.data.data
}

export const unenrollStudent = async ({ userId, courseId }) => {
    const res = await api.delete(`/api/courses/unenroll/${userId}/${courseId}`)
    return res.data.data
}

export const fetchCoursesByTeacher = async (teacherId) => {
    const res = await api.get(API_ENDPOINTS.COURSE_TEACHER(teacherId))
    return res.data.data
}

export const assignTeacherToCourses = async (assignmentData) => {
    const res = await api.post(API_ENDPOINTS.ASSIGN_TEACHER_COURSE, assignmentData)
    return res.data.data
}
