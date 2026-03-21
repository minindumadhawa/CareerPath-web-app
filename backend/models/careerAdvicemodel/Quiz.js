const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required']
  },
  options: {
    type: [String],
    validate: {
      validator: function(v) { return v.length === 4; },
      message: 'Exactly 4 options are required'
    },
    required: true
  },
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer index is required'],
    min: 0,
    max: 3
  },
  explanation: {
    type: String,
    default: ''
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Leadership', 'Technical', 'Soft Skills', 'General Knowledge', 'Career Development']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  timeLimit: {
    type: Number,
    required: [true, 'Time limit is required'],
    min: [1, 'Time limit must be at least 1 minute']
  },
  questions: {
    type: [questionSchema],
    validate: {
      validator: function(v) { return v.length >= 1; },
      message: 'At least 1 question is required'
    }
  },
  passingScore: {
    type: Number,
    required: [true, 'Passing score is required'],
    min: 0,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const quizResultSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  timeTaken: { type: Number },
  passed: { type: Boolean, required: true },
  answers: [{ questionIndex: Number, selectedAnswer: Number, isCorrect: Boolean }]
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);
const QuizResult = mongoose.model('QuizResult', quizResultSchema);

module.exports = { Quiz, QuizResult };
