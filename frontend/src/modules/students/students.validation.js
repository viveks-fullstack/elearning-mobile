import * as yup from 'yup'

export const createStudentSchema = yup.object({
    image: yup.mixed().required('Image is required'),
    name: yup.string().required('Name is required'),
    email: yup.string().email('Enter valid email').required('Email is required'),
    phone: yup.string().required('Phone is required'),
    password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),

    parents: yup.object({
        father: yup.object({
            name: yup.string().required('Father name is required'),
            phone: yup.string().required('Father phone is required')
        }).required('Father details are required'),

        mother: yup.object({
            name: yup.string().nullable(),
            phone: yup.string().nullable()
        }).nullable()
    }).nullable()
})

export const updateStudentSchema = yup.object({
    image: yup.mixed().required('Image is required'),
    name: yup.string().required('Name is required'),
    email: yup.string().email('Enter valid email').required('Email is required'),
    phone: yup.string().required('Phone is required'),
    password: yup.string().min(6, 'Minimum 6 characters').nullable(),

    parents: yup.object({
        father: yup.object({
            name: yup.string().required('Father name is required'),
            phone: yup.string().required('Father phone is required')
        }).required('Father details are required'),

        mother: yup.object({
            name: yup.string().nullable(),
            phone: yup.string().nullable()
        }).nullable()
    }).nullable()
})
