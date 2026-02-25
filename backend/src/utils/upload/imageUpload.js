import fs from 'fs'
import { validateImageFile } from './imageValidate.js'
import { getUploadPath, generateFileName } from './filePath.js'

export const uploadImage = async ({ file, folder, userId }) => {
  validateImageFile(file)

  const uploadDir = getUploadPath(folder)
  const filename = generateFileName(userId, file.filename)
  const filepath = `${uploadDir}/${filename}`

  const buffer = await file.toBuffer()
  await fs.promises.writeFile(filepath, buffer)

  return `/uploads/${folder}/${filename}`
}