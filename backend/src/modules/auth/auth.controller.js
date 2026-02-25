import bcrypt from 'bcrypt'
import User from '../user/user.model.js'
import { success, error } from '../../utils/response.js'

export const login = async (req, reply) => {
  try {
    const { email, password } = req.body

    // Include password explicitly
    const user = await User.findByEmailOrPhone(email, true)

    if (!user || !user.password) {
      return error(reply, 'Invalid credentials', 401)
    }

    // Optional: Check if account active
    if (!user.isActive) {
      return error(reply, 'Account is deactivated', 403)
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return error(reply, 'Invalid credentials', 401)
    }

    const token = req.server.jwt.sign({
      id: user._id,
      role: user.role
    })

    return success(
      reply,
      {
        token,
        role: user.role
      },
      'Login successful'
    )

  } catch (err) {
    req.log.error(err) // fastify logger
    return error(reply, 'Something went wrong', 500)
  }
}