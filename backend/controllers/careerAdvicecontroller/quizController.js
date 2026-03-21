const { Quiz, QuizResult } = require('../../models/careerAdvicemodel/Quiz');

// GET all quizzes (student - no answers)
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isActive: true }, '-questions.correctAnswer -questions.explanation').sort({ createdAt: -1 });
    res.json({ success: true, data: quizzes, count: quizzes.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET all quizzes (admin)
const getAllQuizzesAdmin = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json({ success: true, data: quizzes, count: quizzes.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET quiz for taking (no correct answers exposed)
const getQuizForTaking = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id, '-questions.correctAnswer');
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.json({ success: true, data: quiz });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET all quiz results (admin)
const getAllResults = async (req, res) => {
  try {
    const results = await QuizResult.find().populate('quizId', 'title category').sort({ createdAt: -1 });
    res.json({ success: true, data: results, count: results.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST create quiz
const createQuiz = async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    const saved = await quiz.save();
    res.status(201).json({ success: true, data: saved, message: 'Quiz created successfully!' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: errors.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST submit quiz answers
const submitQuiz = async (req, res) => {
  try {
    const { studentName, studentEmail, answers, timeTaken } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    let correct = 0;
    const processedAnswers = quiz.questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctAnswer;
      if (isCorrect) correct++;
      return {
        questionIndex: i,
        selectedAnswer: answers[i],
        isCorrect,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      };
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    const result = new QuizResult({
      quizId: quiz._id, studentName, studentEmail, score,
      totalQuestions: quiz.questions.length, timeTaken, passed,
      answers: processedAnswers.map(a => ({ questionIndex: a.questionIndex, selectedAnswer: a.selectedAnswer, isCorrect: a.isCorrect }))
    });
    await result.save();

    res.json({
      success: true,
      data: { score, correct, total: quiz.questions.length, passed, passingScore: quiz.passingScore, processedAnswers, resultId: result._id },
      message: passed ? '🎉 Congratulations! You passed!' : 'Keep practicing and try again!'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT update quiz
const updateQuiz = async (req, res) => {
  try {
    const updated = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.json({ success: true, data: updated, message: 'Quiz updated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE quiz
const deleteQuiz = async (req, res) => {
  try {
    const deleted = await Quiz.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Quiz not found' });
    res.json({ success: true, message: 'Quiz deleted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllQuizzes, getAllQuizzesAdmin, getQuizForTaking, getAllResults, createQuiz, submitQuiz, updateQuiz, deleteQuiz };
