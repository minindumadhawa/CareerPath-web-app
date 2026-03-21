const Leadership = require('../../models/careerAdvicemodel/Leadership');

// GET all active programs (student)
const getAllPrograms = async (req, res) => {
  try {
    const programs = await Leadership.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: programs, count: programs.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET all programs (admin)
const getAllProgramsAdmin = async (req, res) => {
  try {
    const programs = await Leadership.find().sort({ createdAt: -1 });
    res.json({ success: true, data: programs, count: programs.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET single program
const getProgramById = async (req, res) => {
  try {
    const program = await Leadership.findById(req.params.id);
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, data: program });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST create program
const createProgram = async (req, res) => {
  try {
    const program = new Leadership(req.body);
    const saved = await program.save();
    res.status(201).json({ success: true, data: saved, message: 'Leadership program added successfully!' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: errors.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT update program
const updateProgram = async (req, res) => {
  try {
    const updated = await Leadership.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, data: updated, message: 'Program updated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE program
const deleteProgram = async (req, res) => {
  try {
    const deleted = await Leadership.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Program not found' });
    res.json({ success: true, message: 'Program deleted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllPrograms, getAllProgramsAdmin, getProgramById, createProgram, updateProgram, deleteProgram };
