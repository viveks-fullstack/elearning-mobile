import * as yup from 'yup'

export const loginSchema = yup.object({
    email: yup
        .string()
        .email('Enter valid email')
        .required('Email is required'),

    password: yup
        .string()
        .min(6, 'Minimum 6 characters')
        .required('Password is required')
})