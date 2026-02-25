import fp from 'fastify-plugin'
import fastifyJwt from '@fastify/jwt'

export default fp(async (app) => {
  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET
  })

  app.decorate('authenticate', async (req) => {
    await req.jwtVerify()
  })
})