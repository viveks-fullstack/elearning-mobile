/**
 * Custom Error Classes for Better Error Handling
 * Provides specific error types with HTTP status codes
 */

export class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = isOperational
        this.timestamp = new Date().toISOString()
        Error.captureStackTrace(this, this.constructor)
    }
}

export class ValidationError extends AppError {
    constructor(message = 'Validation failed', errors = []) {
        super(message, 422)
        this.errors = errors
        this.name = 'ValidationError'
    }
}

export class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401)
        this.name = 'AuthenticationError'
    }
}

export class AuthorizationError extends AppError {
    constructor(message = 'Access denied') {
        super(message, 403)
        this.name = 'AuthorizationError'
    }
}

export class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404)
        this.name = 'NotFoundError'
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Resource already exists') {
        super(message, 409)
        this.name = 'ConflictError'
    }
}

export class BadRequestError extends AppError {
    constructor(message = 'Bad request') {
        super(message, 400)
        this.name = 'BadRequestError'
    }
}
