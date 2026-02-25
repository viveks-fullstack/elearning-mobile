/**
 * Global Error Handler
 * Catches and formats all errors consistently
 */

import { error, serverError } from './response.js'
import { logger } from './logger.js'
import { AppError } from './customErrors.js'

export const errorHandler = (app) => {
  app.setErrorHandler((err, req, reply) => {
    // Log the error
    logger.error('Error occurred', err, {
      method: req.method,
      url: req.url,
      ip: req.ip
    })

    // Handle custom app errors
    if (err instanceof AppError) {
      return error(reply, err.message, err.statusCode, err.errors)
    }

    // Yup validation error
    if (err.name === 'ValidationError') {
      return error(reply, 'Validation failed', 422, err.errors)
    }

    // Mongoose validation error
    if (err.name === 'MongooseValidationError') {
      const errors = Object.values(err.errors).map(e => e.message)
      return error(reply, 'Validation failed', 422, errors)
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0]
      return error(reply, `${field} already exists`, 409)
    }

    // JWT errors
    if (err.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER') {
      return error(reply, 'Authorization header required', 401)
    }

    if (err.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID' || err.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
      return error(reply, 'Invalid or expired token', 401)
    }

    // Fastify validation error
    if (err.validation) {
      return error(reply, 'Invalid request data', 400, err.validation)
    }

    // Custom error with statusCode
    if (err.statusCode && err.statusCode < 500) {
      return error(reply, err.message, err.statusCode)
    }

    // Unknown server errors
    return serverError(reply, err)
  })
}