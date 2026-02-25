import toast from 'react-hot-toast'

const baseConfig = {
    duration: 3000,
    position: 'top-center',
    style: {
        borderRadius: '10px',
        padding: '12px 16px',
        fontSize: '14px'
    }
}

export const toastSuccess = (message) =>
    toast.success(message, {
        ...baseConfig,
        style: {
            ...baseConfig.style,
            background: '#e6f9f0',
            color: '#0f5132'
        }
    })

export const toastError = (message) =>
    toast.error(message, {
        ...baseConfig,
        style: {
            ...baseConfig.style,
            background: '#fdecea',
            color: '#842029'
        }
    })

export const toastWarning = (message) =>
    toast(message, {
        ...baseConfig,
        icon: '⚠️',
        style: {
            ...baseConfig.style,
            background: '#fff3cd',
            color: '#664d03'
        }
    })

export const toastInfo = (message) =>
    toast(message, {
        ...baseConfig,
        icon: 'ℹ️'
    })



export const toastApiError = (error) => {
    const message =
        error?.response?.data?.message || 'Something went wrong'
    toastError(message)
}