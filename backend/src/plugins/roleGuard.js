export const roleGuard = (roles) => {
  return async (req, reply) => {
    await req.jwtVerify()
    if (!roles.includes(req.user.role)) {
      return reply.code(403).send({ message: 'Forbidden' })
    }
  }
}