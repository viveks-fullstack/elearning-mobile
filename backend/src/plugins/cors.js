import cors from '@fastify/cors'

export default async function registerCors(app) {
    const isProd = process.env.NODE_ENV === 'production'

    const allowedOrigins = isProd
        ? [process.env.FRONTEND_URL_PROD]
        : [process.env.FRONTEND_URL_DEV]

    await app.register(cors, {
        origin: (origin, cb) => {
            // Allow server-to-server requests (like Postman)
            if (!origin) return cb(null, true)

            if (allowedOrigins.includes(origin)) {
                cb(null, true)
            } else {
                cb(new Error('Not allowed by CORS'), false)
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
}