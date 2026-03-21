const express = require('express');
const router = express.Router();
const {
  getAllPrograms,
  getAllProgramsAdmin,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram
} = require('../../controllers/careerAdvicecontroller/leadershipController');
const { validateProgram } = require('../../middleware/validateMiddleware');

router.get('/', getAllPrograms);
router.get('/admin/all', getAllProgramsAdmin);
router.get('/:id', getProgramById);
router.post('/', validateProgram, createProgram);
router.put('/:id', validateProgram, updateProgram);
router.delete('/:id', deleteProgram);

module.exports = router;
