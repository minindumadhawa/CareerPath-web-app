// Validate leadership/technical program request body
const validateProgram = (req, res, next) => {
  const { title, description, instructor, duration, level, category } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }
  if (title.trim().length < 5) {
    return res.status(400).json({ success: false, message: 'Title must be at least 5 characters' });
  }
  if (/[^a-zA-Z0-9\s\-&./]/.test(title.trim())) {
    return res.status(400).json({ success: false, message: 'Title cannot contain special symbols' });
  }
  if (!description || !description.trim()) {
    return res.status(400).json({ success: false, message: 'Description is required' });
  }
  if (description.trim().length < 20) {
    return res.status(400).json({ success: false, message: 'Description must be at least 20 characters' });
  }
  if (/[^a-zA-Z0-9\s.,]/.test(description.trim())) {
    return res.status(400).json({ success: false, message: 'Description can only contain letters, numbers, spaces, dots and commas' });
  }
  if (!instructor || !instructor.trim()) {
    return res.status(400).json({ success: false, message: 'Instructor name is required' });
  }
  if (/[^a-zA-Z\s.\-]/.test(instructor.trim())) {
    return res.status(400).json({ success: false, message: 'Instructor name cannot contain numbers or symbols' });
  }
  if (!duration || !duration.trim()) {
    return res.status(400).json({ success: false, message: 'Duration is required' });
  }
  if (!level) {
    return res.status(400).json({ success: false, message: 'Level is required' });
  }
  if (!category) {
    return res.status(400).json({ success: false, message: 'Category is required' });
  }

  next();
};

// Validate quiz request body
const validateQuiz = (req, res, next) => {
  const { title, description, timeLimit, passingScore, category, questions } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Quiz title is required' });
  }
  if (title.trim().length < 5) {
    return res.status(400).json({ success: false, message: 'Title must be at least 5 characters' });
  }
  if (/[^a-zA-Z0-9\s\-&]/.test(title.trim())) {
    return res.status(400).json({ success: false, message: 'Title cannot contain special symbols' });
  }
  if (!description || !description.trim()) {
    return res.status(400).json({ success: false, message: 'Description is required' });
  }
  if (!category) {
    return res.status(400).json({ success: false, message: 'Category is required' });
  }
  if (!timeLimit || isNaN(timeLimit) || Number(timeLimit) < 1) {
    return res.status(400).json({ success: false, message: 'Time limit must be at least 1 minute' });
  }
  if (passingScore === undefined || isNaN(passingScore) || Number(passingScore) < 0 || Number(passingScore) > 100) {
    return res.status(400).json({ success: false, message: 'Passing score must be between 0 and 100' });
  }
  if (!questions || questions.length < 1) {
    return res.status(400).json({ success: false, message: 'At least 1 question is required' });
  }

  next();
};

// Validate enrollment request body
const validateEnrollment = (req, res, next) => {
  const { studentName, studentEmail, programId } = req.body;

  if (!studentName || !studentName.trim()) {
    return res.status(400).json({ success: false, message: 'Student name is required' });
  }
  if (!studentEmail || !studentEmail.trim()) {
    return res.status(400).json({ success: false, message: 'Student email is required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
  }
  if (!programId) {
    return res.status(400).json({ success: false, message: 'Program ID is required' });
  }

  next();
};

module.exports = { validateProgram, validateQuiz, validateEnrollment };
