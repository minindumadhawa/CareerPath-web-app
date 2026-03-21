const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Video title is required'] },
  url: {
    type: String,
    required: [true, 'Video URL is required'],
    validate: {
      validator: function(v) { return /^https?:\/\/.+/.test(v); },
      message: 'Please enter a valid URL'
    }
  }
});

const technicalSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Programming', 'Database', 'Web Development', 'Mobile Development', 'Cloud & DevOps', 'Data Science', 'Cybersecurity', 'UI/UX Design']
  },
  description: { type: String, required: [true, 'Description is required'], minlength: [20, 'Description must be at least 20 characters'] },
  instructor: { type: String, required: [true, 'Instructor name is required'] },
  duration: { type: String, required: [true, 'Duration is required'] },
  level: {
    type: String,
    required: [true, 'Level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  videos: {
    type: [videoSchema],
    validate: {
      validator: function(v) { return v.length >= 1; },
      message: 'At least 1 video is required'
    }
  },
  tags: { type: [String], default: [] },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('TechnicalResource', technicalSchema);
