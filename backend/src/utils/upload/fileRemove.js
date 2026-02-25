import fs from 'fs'
import path from 'path'

export const removeFileIfExists = (fileUrl) => {
  if (!fileUrl) return

  const filePath = path.join(process.cwd(), fileUrl)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
  }
}