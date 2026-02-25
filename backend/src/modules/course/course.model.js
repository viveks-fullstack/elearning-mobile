import mongoose from 'mongoose'

const schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        code: {
            type: String,
            unique: true,
            sparse: true,
            trim: true
        },

        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        duration: {
            type: Number, // in hours
            default: 0
        },

        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'beginner'
        },

        isActive: {
            type: Boolean,
            default: true
        },

        thumbnail: {
            type: String,
            default: null
        }
    },
    { timestamps: true }
)

schema.index({ title: 'text', description: 'text' })

export default mongoose.model('Course', schema)
