import { login } from './auth.controller.js'
import { loginSchema } from './auth.validation.js'
import { validate } from '../../utils/validate.js'

export default async function (app) {
  app.post('/login', { preHandler: validate(loginSchema) }, login)
}