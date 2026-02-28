import {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
  regenerateMeetingLink,
  generateAuthorizedMeetingLink,
  joinMeeting,
  getClassesByTeacher,
  assignTeacherToClasses
} from './class.controller.js'
import {
  enrollStudentInClass,
  getStudentClasses,
  getClassStudents,
  updateClassProgress,
  unenrollStudentFromClass
} from '../user/userClass.controller.js'
import { createClassSchema, updateClassSchema } from './class.validation.js'
import { enrollClassSchema, updateClassProgressSchema } from '../user/userClass.validation.js'
import { validate } from '../../utils/validate.js'
import { roleGuard } from '../../plugins/roleGuard.js'

export default async function (app) {
  // Class CRUD
  app.post(
    '/',
    { preHandler: [roleGuard(['admin', 'teacher']), validate(createClassSchema)] },
    createClass
  )

  app.get(
    '/',
    { preHandler: roleGuard(['admin', 'teacher', 'student']) },
    getClasses
  )

  app.get(
    '/:id/meeting-link',
    { preHandler: roleGuard(['admin', 'teacher', 'student']) },
    generateAuthorizedMeetingLink
  )

  app.get(
    '/:id/join-meeting',
    { preHandler: roleGuard(['admin', 'teacher', 'student']) },
    joinMeeting
  )

  app.get(
    '/:id',
    { preHandler: roleGuard(['admin', 'teacher', 'student']) },
    getClassById
  )

  app.put(
    '/:id',
    { preHandler: [roleGuard(['admin', 'teacher']), validate(updateClassSchema)] },
    updateClass
  )

  app.delete(
    '/:id',
    { preHandler: roleGuard(['admin']) },
    deleteClass
  )

  app.post(
    '/:id/regenerate-link',
    { preHandler: roleGuard(['admin', 'teacher']) },
    regenerateMeetingLink
  )

  // Class Enrollment
  app.post(
    '/enroll',
    { preHandler: [roleGuard(['admin', 'teacher']), validate(enrollClassSchema)] },
    enrollStudentInClass
  )

  app.get(
    '/student/:userId',
    { preHandler: roleGuard(['admin', 'teacher', 'student']) },
    getStudentClasses
  )

  app.get(
    '/:classId/students',
    { preHandler: roleGuard(['admin', 'teacher']) },
    getClassStudents
  )

  app.put(
    '/progress',
    { preHandler: [roleGuard(['admin', 'teacher', 'student']), validate(updateClassProgressSchema)] },
    updateClassProgress
  )

  app.delete(
    '/unenroll/:userId/:classId',
    { preHandler: roleGuard(['admin', 'teacher']) },
    unenrollStudentFromClass
  )

  // Teacher assignments
  app.get(
    '/teacher/:teacherId',
    { preHandler: roleGuard(['admin', 'teacher']) },
    getClassesByTeacher
  )

  app.post(
    '/assign-teacher',
    { preHandler: roleGuard(['admin']) },
    assignTeacherToClasses
  )
}