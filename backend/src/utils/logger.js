/**
 * Logger Utility for Consistent Logging
 * Provides structured logging with different levels
 */

const LOG_LEVELS = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG'
}

const formatLog = (level, message, meta = {}) => {
    return {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...meta
    }
}

export const logger = {
    error: (message, error = null, meta = {}) => {
        const log = formatLog(LOG_LEVELS.ERROR, message, {
            ...meta,
            error: error ? {
                message: error.message,
                stack: error.stack,
                ...error
            } : null
        })
        console.error(JSON.stringify(log))
    },

    warn: (message, meta = {}) => {
        const log = formatLog(LOG_LEVELS.WARN, message, meta)
        console.warn(JSON.stringify(log))
    },

    info: (message, meta = {}) => {
        const log = formatLog(LOG_LEVELS.INFO, message, meta)
        console.info(JSON.stringify(log))
    },

    debug: (message, meta = {}) => {
        if (process.env.NODE_ENV === 'development') {
            const log = formatLog(LOG_LEVELS.DEBUG, message, meta)
            console.debug(JSON.stringify(log))
        }
    }
}
