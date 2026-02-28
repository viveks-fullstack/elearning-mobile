import Class from './class.model.js'
import { success, successWithPagination } from '../../utils/response.js'
import { NotFoundError } from '../../utils/customErrors.js'
import { MEETING_LINK_TOKEN_BYTES, PAGINATION } from '../../utils/constants.js'
import { logger } from '../../utils/logger.js'
import crypto from 'crypto'

const JITSI_BASE_URL = process.env.JITSI_BASE_URL || 'https://meet.jit.si'
const JOIN_LINK_EXPIRES_IN = '15m'

const generateRoomName = () => {
  const token = crypto.randomBytes(MEETING_LINK_TOKEN_BYTES).toString('hex')
  return `elearning-${token}`
}

const generateMeetingLink = () => {
  const room = generateRoomName()
  return `${JITSI_BASE_URL}/${room}`
}

const normalizeId = (value) => (value ? String(value) : '')

const sanitizeClassData = (classData) => {
  if (!classData) return classData
  const plain = classData.toObject ? classData.toObject() : { ...classData }
  delete plain.meetingLink
  return plain
}

const canAccessClassMeeting = (classData, user) => {
  if (!classData || !user) return false

  if (user.role === 'admin') return true

  const userId = normalizeId(user.id)
  const teacherId = normalizeId(classData.teacher)

  if (user.role === 'teacher' && teacherId === userId) {
    return true
  }

  if (user.role === 'student') {
    return classData.students.some((studentId) => normalizeId(studentId) === userId)
  }

  return false
}

const canManageClassMeeting = (classData, user) => {
  if (!classData || !user) return false
  if (user.role === 'admin') return true

  const userId = normalizeId(user.id)
  const teacherId = normalizeId(classData.teacher)

  return user.role === 'teacher' && teacherId === userId
}

export const createClass = async (req, reply) => {
  const classData = {
    ...req.body,
    meetingLink: generateMeetingLink()
  }
  const data = await Class.create(classData)
  logger.info(`Class created: ${data._id}`)
  return success(reply, sanitizeClassData(data), 'Class created successfully', 201)
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

  return successWithPagination(
    reply,
    data.map((classData) => sanitizeClassData(classData)),
    { page, limit, total },
    'Classes fetched successfully'
  )
}

export const getClassById = async (req, reply) => {
  const data = await Class.findById(req.params.id).populate('teacher students')

  if (!data) {
    throw new NotFoundError('Class', req.params.id)
  }

  return success(reply, sanitizeClassData(data), 'Class fetched successfully', 200)
}

export const updateClass = async (req, reply) => {
  const existingClass = await Class.findById(req.params.id).select('teacher')

  if (!existingClass) {
    throw new NotFoundError('Class', req.params.id)
  }

  if (!canManageClassMeeting(existingClass, req.user)) {
    return reply.code(403).send({ message: 'Forbidden' })
  }

  const allowedUpdates = {
    title: req.body.title,
    teacher: req.body.teacher,
    totalHours: req.body.totalHours
  }

  const updatePayload = Object.fromEntries(
    Object.entries(allowedUpdates).filter(([, value]) => value !== undefined)
  )

  const data = await Class.findByIdAndUpdate(
    req.params.id,
    updatePayload,
    { new: true, runValidators: true }
  ).populate('teacher students')

  logger.info(`Class updated: ${data._id}`)
  return success(reply, sanitizeClassData(data), 'Class updated successfully', 200)
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
  const classData = await Class.findById(req.params.id).select('meetingLink teacher students')

  if (!classData) {
    throw new NotFoundError('Class', req.params.id)
  }

  if (!canManageClassMeeting(classData, req.user)) {
    return reply.code(403).send({ message: 'Forbidden' })
  }

  classData.meetingLink = generateMeetingLink()
  await classData.save()

  logger.info(`Meeting link regenerated for class: ${classData._id}`)
  return success(reply, sanitizeClassData(classData), 'Meeting link regenerated successfully', 200)
}

export const generateAuthorizedMeetingLink = async (req, reply) => {
  const classData = await Class.findById(req.params.id).select('meetingLink teacher students')

  if (!classData) {
    throw new NotFoundError('Class', req.params.id)
  }

  if (!canAccessClassMeeting(classData, req.user)) {
    return reply.code(403).send({ message: 'Forbidden' })
  }

  const token = req.server.jwt.sign(
    {
      id: req.user.id,
      role: req.user.role,
      classId: normalizeId(classData._id),
      meetingRole: req.user.role === 'teacher' || req.user.role === 'admin' ? 'moderator' : 'participant',
      purpose: 'jitsi-join'
    },
    { expiresIn: JOIN_LINK_EXPIRES_IN }
  )

  const joinUrl = `${process.env.API_BASE_URL || 'http://localhost:4000'}/api/classes/${classData._id}/join-meeting?token=${token}`

  return success(
    reply,
    {
      joinUrl,
      expiresIn: JOIN_LINK_EXPIRES_IN,
      role: req.user.role === 'teacher' || req.user.role === 'admin' ? 'moderator' : 'participant'
    },
    'Authorized meeting link generated successfully',
    200
  )
}

export const joinMeeting = async (req, reply) => {
  const { token } = req.query || {}

  if (!token) {
    return reply.code(400).send({ message: 'Join token is required' })
  }

  let payload
  try {
    payload = req.server.jwt.verify(token)
  } catch (err) {
    return reply.code(401).send({ message: 'Invalid or expired join token' })
  }

  if (
    payload?.purpose !== 'jitsi-join' ||
    normalizeId(payload.classId) !== normalizeId(req.params.id) ||
    normalizeId(payload.id) !== normalizeId(req.user.id)
  ) {
    return reply.code(403).send({ message: 'Forbidden' })
  }

  const classData = await Class.findById(req.params.id).select('meetingLink teacher students')

  if (!classData) {
    throw new NotFoundError('Class', req.params.id)
  }

  if (!canAccessClassMeeting(classData, req.user)) {
    return reply.code(403).send({ message: 'Forbidden' })
  }

  return reply.redirect(classData.meetingLink)
}

export const getClassesByTeacher = async (req, reply) => {
  if (req.user.role === 'teacher' && normalizeId(req.user.id) !== normalizeId(req.params.teacherId)) {
    return reply.code(403).send({ message: 'Forbidden' })
  }

  const data = await Class.find({ teacher: req.params.teacherId }).populate('teacher students')
  return success(reply, data.map((classData) => sanitizeClassData(classData)), 'Teacher classes fetched successfully', 200)
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
  return success(
    reply,
    data.map((classData) => sanitizeClassData(classData)),
    'Classes assigned to teacher successfully',
    200
  )
}