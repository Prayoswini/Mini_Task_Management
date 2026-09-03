const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error.middleware');

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware for CORS
app.use(cors());

// Body parser middleware for JSON payload
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route / API health check
app.get('/', (req, res) => {
  res.json({
    message: 'Mini Task Management System API is running successfully',
    status: 'Active',
    timestamp: new Date()
  });
});

// Mount API routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/tasks', require('./routes/task.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// Fallback 404 & Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Keep server running or close gracefully if necessary
});

module.exports = app;
