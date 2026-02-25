/**
 * Profile Validation Schemas
 * Validation rules for profile forms
 */

import * as Yup from 'yup';

export const updateProfileSchema = Yup.object({
    name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .required('Name is required'),
    email: Yup.string()
        .email('Invalid email format')
        .required('Email is required'),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone must be 10 digits')
        .required('Phone is required'),
    profileImage: Yup.string()
        .url('Invalid image URL')
        .nullable()
});

export const changePasswordSchema = Yup.object({
    currentPassword: Yup.string()
        .required('Current password is required'),
    newPassword: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('New password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Confirm password is required')
});
