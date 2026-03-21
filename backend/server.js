const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/leadership', require('./routes/careerAdviceroute/leadershipRoutes'));
app.use('/api/technical', require('./routes/careerAdviceroute/technicalRoutes'));
app.use('/api/quiz', require('./routes/careerAdviceroute/quizRoutes'));
app.use('/api/enrollments', require('./routes/careerAdviceroute/enrollmentRoutes'));

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://vishmiishanka14_db_user:wzLO1AkrRlVEnV4h@cluster0.mjiovjd.mongodb.net/careeradvice';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
