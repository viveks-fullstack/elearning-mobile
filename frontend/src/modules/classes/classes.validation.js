import * as yup from 'yup'

export const createClassSchema = yup.object({
    title: yup.string().required('Title is required'),
    totalHours: yup.number().positive('Must be positive').required('Total hours is required')
})
