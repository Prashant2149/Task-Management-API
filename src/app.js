const express = require('express');
const helmet = require('helmet');
//const xss = require('xss');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('../src/middlewares/error.middleware');

const authRoutes = require('../src/routes/auth.routes');
const taskRoutes = require('../src/routes/task.routes');

const app = express();

// Middlewares
app.use(helmet()); // For securing headers
//app.use(xss()); // For sanitizing inputs
app.use(express.json()); // Parse JSON body

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Error handler
app.use(errorHandler);

module.exports = { app };