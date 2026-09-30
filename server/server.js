const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', system: 'Winter Arc Backend Online', timestamp: new Date().toISOString() });
});

// Mounting API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/winterarc', require('./routes/winterArcRoutes'));
app.use('/api/habits', require('./routes/habitRoutes'));
app.use('/api/checkin', require('./routes/checkInRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/developer', require('./routes/developerRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/job-applications', require('./routes/jobRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/achievements', require('./routes/achievementRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/reminders', require('./routes/reminderRoutes'));
app.use('/api/export', require('./routes/backupRoutes'));

// Global Error Handler
app.use(errorHandler);

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Winter Arc Server running on port ${PORT}`);
  });
}

module.exports = app;
