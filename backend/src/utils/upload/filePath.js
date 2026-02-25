import fs from 'fs'
import path from 'path'

export const getUploadPath = (folder) => {
  const dir = path.join(process.cwd(), 'uploads', folder)

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  return dir
}

export const generateFileName = (id, originalName) => {
  const ext = path.extname(originalName)
  return `${id}-${Date.now()}${ext}`
}