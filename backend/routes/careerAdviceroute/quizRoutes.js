const express = require('express');
const router = express.Router();
const {
  getAllQuizzes,
  getAllQuizzesAdmin,
  getQuizForTaking,
  getAllResults,
  createQuiz,
  submitQuiz,
  updateQuiz,
  deleteQuiz
} = require('../../controllers/careerAdvicecontroller/quizController');
const { validateQuiz } = require('../../middleware/validateMiddleware');

router.get('/', getAllQuizzes);
router.get('/admin/all', getAllQuizzesAdmin);
router.get('/results', getAllResults);
router.get('/take/:id', getQuizForTaking);
router.post('/', validateQuiz, createQuiz);
router.post('/submit/:id', submitQuiz);
router.put('/:id', updateQuiz);
router.delete('/:id', deleteQuiz);

module.exports = router;
