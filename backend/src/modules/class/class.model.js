import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  title: String,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  meetingLink: String,
  totalHours: Number
}, { timestamps: true })

schema.methods.addStudent = function (studentId) {
  this.students.push(studentId)
  return this.save()
}

export default mongoose.model('Class', schema)