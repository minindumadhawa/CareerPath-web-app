const Enrollment = require('../../models/careerAdvicemodel/Enrollment');

// POST enroll
const createEnrollment = async (req, res) => {
  try {
    const { studentName, studentEmail, programId, programType } = req.body;
    const existing = await Enrollment.findOne({ studentEmail, programId });
    if (existing) {
      return res.json({ success: true, data: existing, message: 'Already enrolled', alreadyEnrolled: true });
    }
    const enrollment = new Enrollment({
      studentName, studentEmail, programId,
      programType: programType || 'Leadership',
      watchedVideos: []
    });
    await enrollment.save();
    res.status(201).json({ success: true, data: enrollment, message: 'Enrolled successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH mark video watched
const markVideoWatched = async (req, res) => {
  try {
    const { videoIndex } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
    if (!enrollment.watchedVideos.includes(videoIndex)) {
      enrollment.watchedVideos.push(videoIndex);
    }
    await enrollment.save();
    res.json({ success: true, data: enrollment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH mark complete
const markComplete = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { isCompleted: true, completedAt: new Date() },
      { new: true }
    );
    res.json({ success: true, data: enrollment, message: 'Completed!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET enrollments by student email
const getByStudent = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ studentEmail: req.params.email })
      .populate({ path: 'programId', select: 'title category level instructor duration videos tags' })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: enrollments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET all enrollments (admin)
const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate({ path: 'programId', select: 'title category videos' })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: enrollments, count: enrollments.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createEnrollment, markVideoWatched, markComplete, getByStudent, getAllEnrollments };
