const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  studentName: { type: String, required: [true, 'Student name is required'] },
  studentEmail: {
    type: String,
    required: [true, 'Student email is required'],
    validate: {
      validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Please enter a valid email'
    }
  },
  // Support both program types
  programId: { type: mongoose.Schema.Types.ObjectId, refPath: 'programType' },
  programType: {
    type: String,
    required: true,
    enum: ['Leadership', 'TechnicalResource']
  },
  watchedVideos: [{ type: Number }],
  completedAt: { type: Date, default: null },
  isCompleted: { type: Boolean, default: false },
}, { timestamps: true });

enrollmentSchema.index({ studentEmail: 1, programId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
