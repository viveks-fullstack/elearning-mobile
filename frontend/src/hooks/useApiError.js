/**
 * API Error Handler Hook
 * Provides consistent error handling and user feedback
 */

import { useCallback } from 'react'
import toast from 'react-hot-toast'
import { HTTP_STATUS } from './constants'

export const useApiError = () => {
    const handleError = useCallback((error, customMessage = null) => {
        // Network error
        if (!error.response) {
            toast.error('Network error. Please check your connection.')
            return
        }

        const { status, data } = error.response

        // Use custom message if provided
        if (customMessage) {
            toast.error(customMessage)
            return
        }

        // Handle specific status codes
        switch (status) {
            case HTTP_STATUS.BAD_REQUEST:
                toast.error(data?.message || 'Invalid request')
                break

            case HTTP_STATUS.UNAUTHORIZED:
                toast.error('Session expired. Please login again.')
                // Optionally redirect to login
                break

            case HTTP_STATUS.FORBIDDEN:
                toast.error('You don\'t have permission to perform this action')
                break

            case HTTP_STATUS.NOT_FOUND:
                toast.error(data?.message || 'Resource not found')
                break

            case HTTP_STATUS.CONFLICT:
                toast.error(data?.message || 'Resource already exists')
                break

            case HTTP_STATUS.UNPROCESSABLE_ENTITY:
                // Handle validation errors
                if (Array.isArray(data?.errors)) {
                    data.errors.forEach(err => toast.error(err))
                } else {
                    toast.error(data?.message || 'Validation failed')
                }
                break

            case HTTP_STATUS.SERVER_ERROR:
                toast.error('Server error. Please try again later.')
                break

            default:
                toast.error(data?.message || 'An error occurred')
        }
    }, [])

    return { handleError }
}
