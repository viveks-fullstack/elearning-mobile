import { error } from './response.js'

export const validate = (schema) => async (req, reply) => {
  try {
    req.body = await schema.validate(req.body, { abortEarly: false })
  } catch (err) {
    return error(reply, 'Validation failed', 422, err.errors)
  }
}