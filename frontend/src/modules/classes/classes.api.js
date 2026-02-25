/**
 * Classes API
 * API functions for class management
 */

import api from '../../app/axios'
import { API_ENDPOINTS } from '../../utils/constants'

export const fetchClasses = async (params = {}) => {
    const { page = 1, limit = 10 } = params
    const res = await api.get(API_ENDPOINTS.CLASSES, {
        params: { page, limit }
    })
    return {
        data: res.data.data,
        pagination: res.data.pagination
    }
}

export const fetchClassById = async (id) => {
    const res = await api.get(API_ENDPOINTS.CLASS(id))
    return res.data.data
}

export const createClass = async (classData) => {
    const res = await api.post(API_ENDPOINTS.CLASSES, classData)
    return res.data.data
}

export const updateClass = async ({ id, classData }) => {
    const res = await api.put(API_ENDPOINTS.CLASS(id), classData)
    return res.data.data
}

export const deleteClass = async (id) => {
    const res = await api.delete(API_ENDPOINTS.CLASS(id))
    return res.data.data
}

export const regenerateMeetingLink = async (id) => {
    const res = await api.post(API_ENDPOINTS.REGENERATE_LINK(id))
    return res.data.data
}

export const fetchClassesByTeacher = async (teacherId) => {
    const res = await api.get(API_ENDPOINTS.CLASS_TEACHER(teacherId))
    return res.data.data
}

export const assignTeacherToClasses = async (assignmentData) => {
    const res = await api.post(API_ENDPOINTS.ASSIGN_TEACHER_CLASS, assignmentData)
    return res.data.data
}
