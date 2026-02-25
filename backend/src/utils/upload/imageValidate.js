export const validateImageFile = (file) => {
  if (!file) {
    const err = new Error('Image file is required')
    err.statusCode = 400
    throw err
  }

  if (!file.mimetype || !file.mimetype.startsWith('image/')) {
    const err = new Error('Only image files are allowed')
    err.statusCode = 400
    throw err
  }

  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ]

  if (!allowedTypes.includes(file.mimetype)) {
    const err = new Error(
      'Invalid image format. Allowed: jpg, jpeg, png, webp'
    )
    err.statusCode = 400
    throw err
  }

  return true
}