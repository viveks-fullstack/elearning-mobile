import * as yup from 'yup'

export const createCourseSchema = yup.object({
    title: yup.string().required('Title is required'),
    description: yup.string(),
    code: yup.string(),
    duration: yup.number().min(0),
    level: yup.string().oneOf(['beginner', 'intermediate', 'advanced']),
    thumbnail: yup.string()
})

export const updateCourseSchema = yup.object({
    title: yup.string(),
    description: yup.string(),
    code: yup.string(),
    teacher: yup.string(),
    duration: yup.number().min(0),
    level: yup.string().oneOf(['beginner', 'intermediate', 'advanced']),
    thumbnail: yup.string(),
    isActive: yup.boolean()
})

export const enrollCourseSchema = yup.object({
    userId: yup.string().required('User ID is required'),
    courseId: yup.string().required('Course ID is required')
})

export const updateProgressSchema = yup.object({
    userId: yup.string().required('User ID is required'),
    courseId: yup.string().required('Course ID is required'),
    progress: yup.number().min(0).max(100).required('Progress is required')
})
