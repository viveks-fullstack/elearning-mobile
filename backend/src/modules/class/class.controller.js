import Class from './class.model.js'
import { success, successWithPagination } from '../../utils/response.js'
import { NotFoundError } from '../../utils/customErrors.js'
import { MEETING_LINK_TOKEN_BYTES, PAGINATION } from '../../utils/constants.js'
import { logger } from '../../utils/logger.js'
import crypto from 'crypto'

// Generate secure meeting link
const generateMeetingLink = () => {
  const token = crypto.randomBytes(MEETING_LINK_TOKEN_BYTES).toString('hex')
  return `https://meet.elearning.com/${token}`
}

export const createClass = async (req, reply) => {
  const classData = {
    ...req.body,
    meetingLink: generateMeetingLink()
  }
  const data = await Class.create(classData)
  logger.info(`Class created: ${data._id}`)
  return success(reply, data, 'Class created successfully', 201)
}

export const getClasses = async (req, reply) => {
  const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE
  const limit = Math.min(parseInt(req.query.limit) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT)
  const skip = (page - 1) * limit

  const [data, total] = await Promise.all([
    Class.find()
      .populate('teacher students')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt'),
    Class.countDocuments()
  ])

  return successWithPagination(reply, data, { page, limit, total }, 'Classes fetched successfully')
}

export const getClassById = async (req, reply) => {
  const data = await Class.findById(req.params.id).populate('teacher students')

  if (!data) {
    throw new NotFoundError('Class', req.params.id)
  }

  return success(reply, data, 'Class fetched successfully', 200)
}

export const updateClass = async (req, reply) => {
  const data = await Class.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('teacher students')

  if (!data) {
    throw new NotFoundError('Class', req.params.id)
  }

  logger.info(`Class updated: ${data._id}`)
  return success(reply, data, 'Class updated successfully', 200)
}

export const deleteClass = async (req, reply) => {
  const data = await Class.findByIdAndDelete(req.params.id)

  if (!data) {
    throw new NotFoundError('Class', req.params.id)
  }

  logger.info(`Class deleted: ${data._id}`)
  return success(reply, data, 'Class deleted successfully', 200)
}

export const regenerateMeetingLink = async (req, reply) => {
  const classData = await Class.findByIdAndUpdate(
    req.params.id,
    { meetingLink: generateMeetingLink() },
    { new: true }
  )

  if (!classData) {
    throw new NotFoundError('Class', req.params.id)
  }

  logger.info(`Meeting link regenerated for class: ${classData._id}`)
  return success(reply, classData, 'Meeting link regenerated successfully', 200)
}

export const getClassesByTeacher = async (req, reply) => {
  const data = await Class.find({ teacher: req.params.teacherId }).populate('teacher students')
  return success(reply, data, 'Teacher classes fetched successfully', 200)
}

export const assignTeacherToClasses = async (req, reply) => {
  const { teacherId, classIds } = req.body

  // Remove teacher from all their current classes
  await Class.updateMany(
    { teacher: teacherId },
    { $unset: { teacher: "" } }
  )

  // Assign teacher to new classes
  if (classIds && classIds.length > 0) {
    await Class.updateMany(
      { _id: { $in: classIds } },
      { $set: { teacher: teacherId } }
    )
  }

  logger.info(`Classes assigned to teacher: ${teacherId}`)
  const data = await Class.find({ teacher: teacherId }).populate('teacher')
  return success(reply, data, 'Classes assigned to teacher successfully', 200)
}