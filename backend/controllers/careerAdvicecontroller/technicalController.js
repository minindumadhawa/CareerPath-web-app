const TechnicalResource = require('../../models/careerAdvicemodel/TechnicalResource');

// GET all active resources (student)
const getAllResources = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category && category !== 'All') filter.category = category;
    const resources = await TechnicalResource.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: resources, count: resources.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET all resources (admin)
const getAllResourcesAdmin = async (req, res) => {
  try {
    const resources = await TechnicalResource.find().sort({ createdAt: -1 });
    res.json({ success: true, data: resources, count: resources.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET single resource
const getResourceById = async (req, res) => {
  try {
    const resource = await TechnicalResource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.json({ success: true, data: resource });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST create resource
const createResource = async (req, res) => {
  try {
    const resource = new TechnicalResource(req.body);
    const saved = await resource.save();
    res.status(201).json({ success: true, data: saved, message: 'Technical resource added successfully!' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: errors.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT update resource
const updateResource = async (req, res) => {
  try {
    const updated = await TechnicalResource.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.json({ success: true, data: updated, message: 'Resource updated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE resource
const deleteResource = async (req, res) => {
  try {
    const deleted = await TechnicalResource.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.json({ success: true, message: 'Resource deleted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllResources, getAllResourcesAdmin, getResourceById, createResource, updateResource, deleteResource };
