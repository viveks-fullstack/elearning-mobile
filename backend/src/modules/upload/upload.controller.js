import { success } from '../../utils/response.js'
import { uploadFileLocal, uploadFileS3, deleteFileLocal, deleteFileS3 } from '../../utils/upload/fileUpload.js'

/**
 * Single file upload to local folder
 * POST /upload/local
 */
export const uploadSingleLocal = async (req, reply) => {
    try {
        if (!req.file) {
            return reply.code(400).send({ message: 'No file provided' })
        }

        const filepath = await uploadFileLocal({
            file: req.file,
            folder: 'general',
            userId: req.user?.id || 'anonymous'
        })

        return success(reply, { filepath }, 'File uploaded successfully', 200)
    } catch (err) {
        console.error('Error uploading file locally:', err)
        throw err
    }
}

/**
 * Single file upload to S3
 * POST /upload/s3
 */
export const uploadSingleS3 = async (req, reply) => {
    try {
        if (!req.file) {
            return reply.code(400).send({ message: 'No file provided' })
        }

        const fileUrl = await uploadFileS3({
            file: req.file,
            folder: 'general',
            userId: req.user?.id || 'anonymous'
        })

        return success(reply, { fileUrl }, 'File uploaded to S3 successfully', 200)
    } catch (err) {
        throw err
    }
}

/**
 * Multiple files upload to local folder
 * POST /upload/local/multiple
 */
export const uploadMultipleLocal = async (req, reply) => {
    try {
        if (!req.files || req.files.length === 0) {
            return reply.code(400).send({ message: 'No files provided' })
        }

        const filepaths = await Promise.all(
            req.files.map((file) =>
                uploadFileLocal({
                    file,
                    folder: 'general',
                    userId: req.user?.id || 'anonymous'
                })
            )
        )

        return success(reply, { filepaths }, 'Files uploaded successfully', 200)
    } catch (err) {
        throw err
    }
}

/**
 * Multiple files upload to S3
 * POST /upload/s3/multiple
 */
export const uploadMultipleS3 = async (req, reply) => {
    try {
        if (!req.files || req.files.length === 0) {
            return reply.code(400).send({ message: 'No files provided' })
        }

        const fileUrls = await Promise.all(
            req.files.map((file) =>
                uploadFileS3({
                    file,
                    folder: 'general',
                    userId: req.user?.id || 'anonymous'
                })
            )
        )

        return success(reply, { fileUrls }, 'Files uploaded to S3 successfully', 200)
    } catch (err) {
        throw err
    }
}

/**
 * Delete file from local folder
 * DELETE /upload/local/:filepath
 */
export const deleteLocal = async (req, reply) => {
    try {
        const { filepath } = req.params

        if (!filepath) {
            return reply.code(400).send({ message: 'File path is required' })
        }

        const success_status = await deleteFileLocal(filepath)

        if (!success_status) {
            return reply.code(404).send({ message: 'File not found' })
        }

        return success(reply, {}, 'File deleted successfully', 200)
    } catch (err) {
        throw err
    }
}

/**
 * Delete file from S3
 * DELETE /upload/s3
 */
export const deleteS3 = async (req, reply) => {
    try {
        const { fileUrl } = req.body

        if (!fileUrl) {
            return reply.code(400).send({ message: 'File URL is required' })
        }

        await deleteFileS3(fileUrl)

        return success(reply, {}, 'File deleted from S3 successfully', 200)
    } catch (err) {
        throw err
    }
}
