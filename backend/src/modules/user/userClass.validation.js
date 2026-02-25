import * as yup from 'yup'

export const enrollClassSchema = yup.object({
    userId: yup.string().required('User ID is required'),
    classId: yup.string().required('Class ID is required')
})

export const updateClassProgressSchema = yup.object({
    userId: yup.string().required('User ID is required'),
    classId: yup.string().required('Class ID is required'),
    progress: yup.number().min(0).max(100).required('Progress is required')
})
