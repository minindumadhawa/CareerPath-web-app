const express = require('express');
const router = express.Router();
const {
  createEnrollment,
  markVideoWatched,
  markComplete,
  getByStudent,
  getAllEnrollments
} = require('../../controllers/careerAdvicecontroller/enrollmentController');
const { validateEnrollment } = require('../../middleware/validateMiddleware');

router.post('/', validateEnrollment, createEnrollment);
router.patch('/:id/watch', markVideoWatched);
router.patch('/:id/complete', markComplete);
router.get('/student/:email', getByStudent);
router.get('/admin/all', getAllEnrollments);

module.exports = router;
