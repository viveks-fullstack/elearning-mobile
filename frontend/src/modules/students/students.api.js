/**
 * Students API
 * API functions for student management
 */

import api from '../../app/axios'
import { API_ENDPOINTS } from '../../utils/constants'

export const fetchStudents = async (params = {}) => {
    const { page = 1, limit = 10 } = params
    const res = await api.get(API_ENDPOINTS.STUDENTS, {
        params: { page, limit }
    })
    return {
        data: res.data.data.filter(u => u.role === 'student'),
        pagination: res.data.pagination
    }
}

export const fetchStudentById = async (id) => {
    const res = await api.get(API_ENDPOINTS.STUDENT(id))
    return res.data.data
}

export const fetchClasses = async () => {
    const res = await api.get(API_ENDPOINTS.CLASSES)
    return res.data.data
}

export const fetchCourses = async () => {
    const res = await api.get(API_ENDPOINTS.COURSES)
    return res.data.data
}

export const enrollStudentInClass = async ({ userId, classId }) => {
    const res = await api.post(API_ENDPOINTS.ENROLL_CLASS, { userId, classId })
    return res.data.data
}

export const enrollStudentInCourse = async ({ userId, courseId }) => {
    const res = await api.post(API_ENDPOINTS.ENROLL_COURSE, { userId, courseId })
    return res.data.data
}

export const getStudentClasses = async (userId) => {
    const res = await api.get(API_ENDPOINTS.STUDENT_CLASSES(userId))
    return res.data.data
}

export const getStudentCourses = async (userId) => {
    const res = await api.get(API_ENDPOINTS.STUDENT_COURSES(userId))
    return res.data.data
}

// Upload image to backend (local or S3)
export async function uploadImage({ file, type = 'local' }) {
    const formData = new FormData();
    formData.append('file', file);
    // type: 'local' or 's3'
    const url = type === 's3' ? '/upload/s3' : '/upload/local';
    const response = await api.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

export const addStudent = async (studentData) => {
    const payload = {
        name: studentData.name,
        email: studentData.email,
        phone: studentData.phone,
        password: studentData.password,
        parents: studentData.parents
    }

    if (studentData.image) {
        payload.profileImage = studentData.image
    }

    const res = await api.post(API_ENDPOINTS.STUDENTS, payload)
    return res.data.data
}

export const updateStudent = async ({ id, studentData }) => {
    const payload = {
        name: studentData.name,
        email: studentData.email,
        phone: studentData.phone,
        parents: studentData.parents
    }

    if (studentData.password) {
        payload.password = studentData.password
    }

    if (studentData.image) {
        payload.profileImage = studentData.image
    }

    const res = await api.put(API_ENDPOINTS.STUDENT(id), payload)
    return res.data.data
}

export const deleteStudent = async (id) => {
    const res = await api.delete(API_ENDPOINTS.STUDENT(id))
    return res.data.data
}