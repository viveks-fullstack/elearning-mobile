import app from './app.js'

const start = async () => {
  try {
    await app.listen({ port: process.env.PORT || 4000 })
    console.log('🚀 Backend running')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()