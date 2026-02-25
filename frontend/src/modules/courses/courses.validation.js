import * as yup from 'yup'

export const createCourseSchema = yup.object({
    title: yup.string().required('Title is required'),
    description: yup.string(),
    code: yup.string(),
    duration: yup.number().positive('Duration must be positive').required('Duration is required'),
    level: yup.string().oneOf(['beginner', 'intermediate', 'advanced'], 'Invalid level').required('Level is required')
})

export const updateCourseSchema = yup.object({
    title: yup.string(),
    description: yup.string(),
    code: yup.string(),
    teacher: yup.string(),
    duration: yup.number().positive('Duration must be positive'),
    level: yup.string().oneOf(['beginner', 'intermediate', 'advanced'], 'Invalid level')
})
