const express = require('express');
const router = express.Router();
const {
  getAllResources,
  getAllResourcesAdmin,
  getResourceById,
  createResource,
  updateResource,
  deleteResource
} = require('../../controllers/careerAdvicecontroller/technicalController');
const { validateProgram } = require('../../middleware/validateMiddleware');

router.get('/', getAllResources);
router.get('/admin/all', getAllResourcesAdmin);
router.get('/:id', getResourceById);
router.post('/', validateProgram, createResource);
router.put('/:id', validateProgram, updateResource);
router.delete('/:id', deleteResource);

module.exports = router;
