import * as yup from 'yup';
import { PASSWORD_MIN_LENGTH } from '../../utils/constants.js';

export const updateProfileSchema = yup.object({
    name: yup.string().trim().min(2, 'Name must be at least 2 characters'),
    email: yup.string().email('Invalid email format'),
    phone: yup.string()
        .matches(/^[0-9]{10}$/, 'Phone must be 10 digits')
        .optional(),
    profileImage: yup.string()
        .nullable()
        .test(
            'is-valid-image-path',
            'Invalid image URL',
            (value) => !value || /^https?:\/\//.test(value) || value.startsWith('/uploads/')
        )
});

export const changePasswordSchema = yup.object({
    currentPassword: yup.string().required('Current password is required'),
    newPassword: yup.string()
        .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
        .required('New password is required'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('newPassword')], 'Passwords must match')
        .required('Confirm password is required')
});
