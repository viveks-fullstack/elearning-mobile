/**
 * Axios Instance Configuration
 * Configured with interceptors for request/response handling
 */

import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 30000, // 30 seconds
    headers: {
        'Content-Type': 'application/json'
    }
})

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add auth token if exists
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // Log request in development
        if (import.meta.env.DEV) {
            console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`)
        }

        return config
    },
    (error) => {
        console.error('[API Request Error]', error)
        return Promise.reject(error)
    }
)

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // Log response in development
        if (import.meta.env.DEV) {
            console.log(`[API Response] ${response.config.url}`, response.data)
        }

        return response
    },
    (error) => {
        // Handle common errors
        if (error.response) {
            const { status, data } = error.response

            // Handle 401 - Unauthorized
            if (status === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                // Redirect to login if not already there
                if (window.location.pathname !== '/') {
                    window.location.href = '/'
                }
            }

            // Log error in development
            if (import.meta.env.DEV) {
                console.error(`[API Error] ${error.config?.url}`, {
                    status,
                    message: data?.message,
                    errors: data?.errors
                })
            }
        } else if (error.request) {
            console.error('[API Network Error]', error.message)
        } else {
            console.error('[API Error]', error.message)
        }

        return Promise.reject(error)
    }
)

export default api