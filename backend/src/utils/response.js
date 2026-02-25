/**
 * Response Utilities
 * Standardized response formats for API endpoints
 */

export const success = (
  reply,
  data = null,
  message = 'Success',
  statusCode = 200
) => {
  return reply.code(statusCode).send({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  })
}

export const successWithPagination = (
  reply,
  data = [],
  pagination = {},
  message = 'Success',
  statusCode = 200
) => {
  return reply.code(statusCode).send({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      total: pagination.total || 0,
      totalPages: Math.ceil((pagination.total || 0) / (pagination.limit || 10))
    },
    timestamp: new Date().toISOString()
  })
}

export const error = (
  reply,
  message = 'Error',
  statusCode = 400,
  errors = null
) => {
  return reply.code(statusCode).send({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  })
}

export const serverError = (reply, err) => {
  console.error('Server Error:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  })

  return reply.code(500).send({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
    timestamp: new Date().toISOString()
  })
}

