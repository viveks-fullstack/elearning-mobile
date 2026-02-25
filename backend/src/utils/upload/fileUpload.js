import fs from 'fs'
import { validateImageFile } from './imageValidate.js'
import { getUploadPath, generateFileName } from './filePath.js'

/**
 * Upload file to local upload folder
 * @param {Object} options - Upload options
 * @param {File} options.file - File object with buffer
 * @param {string} options.folder - Folder name inside uploads directory
 * @param {string} options.userId - User ID for filename generation
 * @returns {Promise<string>} Path to uploaded file
 */
export const uploadFileLocal = async ({ file, folder = 'files', userId }) => {
    validateImageFile(file)

    const uploadDir = getUploadPath(folder)
    const filename = generateFileName(userId, file.filename)
    const filepath = `${uploadDir}/${filename}`

    const buffer = await file.toBuffer()
    await fs.promises.writeFile(filepath, buffer)

    return `/uploads/${folder}/${filename}`
}

/**
 * Upload file to AWS S3
 * @param {Object} options - Upload options
 * @param {File} options.file - File object with buffer
 * @param {string} options.folder - Folder path inside S3 bucket
 * @param {string} options.userId - User ID for filename generation
 * @returns {Promise<string>} S3 file URL
 */
export const uploadFileS3 = async ({ file, folder = 'files', userId }) => {
    try {
        validateImageFile(file)

        const filename = generateFileName(userId, file.filename)
        const s3Key = `${folder}/${filename}`

        // TODO: Implement S3 upload using AWS SDK
        // const s3 = new AWS.S3()
        // const buffer = await file.toBuffer()
        // const params = {
        //   Bucket: process.env.AWS_S3_BUCKET_NAME,
        //   Key: s3Key,
        //   Body: buffer,
        //   ContentType: file.mimetype,
        // }
        // await s3.upload(params).promise()
        // return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`

        throw new Error('S3 upload not configured yet')
    } catch (err) {
        throw new Error(`S3 upload failed: ${err.message}`)
    }
}

/**
 * Delete file from local upload folder
 * @param {string} filepath - Path to file to delete
 * @returns {Promise<boolean>} Success status
 */
export const deleteFileLocal = async (filepath) => {
    try {
        if (!filepath) return false

        // Convert URL path to file system path
        const filePath = filepath.replace('/uploads/', process.cwd() + '/uploads/')

        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath)
            return true
        }
        return false
    } catch (err) {
        console.error('File deletion failed:', err)
        throw new Error(`File deletion failed: ${err.message}`)
    }
}

/**
 * Delete file from AWS S3
 * @param {string} s3Url - S3 file URL to delete
 * @returns {Promise<boolean>} Success status
 */
export const deleteFileS3 = async (s3Url) => {
    try {
        // TODO: Implement S3 delete using AWS SDK
        // const s3 = new AWS.S3()
        // const key = s3Url.split('.s3.amazonaws.com/')[1]
        // await s3.deleteObject({
        //   Bucket: process.env.AWS_S3_BUCKET_NAME,
        //   Key: key
        // }).promise()

        return true
    } catch (err) {
        console.error('S3 file deletion failed:', err)
        throw new Error(`S3 file deletion failed: ${err.message}`)
    }
}
