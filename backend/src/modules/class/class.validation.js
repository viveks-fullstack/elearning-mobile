import * as yup from 'yup'

export const createClassSchema = yup.object({
  title: yup.string().required(),
  totalHours: yup.number().required()
})

export const updateClassSchema = yup.object({
  title: yup.string(),
  teacher: yup.string(),
  totalHours: yup.number()
})