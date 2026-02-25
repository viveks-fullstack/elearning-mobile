import { uploadSingleLocal, uploadSingleS3, uploadMultipleLocal, uploadMultipleS3, deleteLocal, deleteS3 } from './upload.controller.js'

// Middleware to handle single file upload
async function handleSingleFile(req, reply) {
    const data = await req.file()
    if (data) {
        req.file = data
    }
}

// Middleware to handle multiple files upload
async function handleMultipleFiles(req, reply) {
    const parts = req.parts()
    req.files = []

    for await (const part of parts) {
        if (part.file) {
            req.files.push(part)
        }
    }
}

export default async function (app) {
    // Single file upload to local
    app.post('/local', { preHandler: handleSingleFile }, uploadSingleLocal)

    // Single file upload to S3
    app.post('/s3', { preHandler: handleSingleFile }, uploadSingleS3)

    // Multiple files upload to local
    app.post('/local/multiple', { preHandler: handleMultipleFiles }, uploadMultipleLocal)

    // Multiple files upload to S3
    app.post('/s3/multiple', { preHandler: handleMultipleFiles }, uploadMultipleS3)

    // Delete file from local
    app.delete('/local/:filepath', deleteLocal)

    // Delete file from S3
    app.delete('/s3', deleteS3)
}
