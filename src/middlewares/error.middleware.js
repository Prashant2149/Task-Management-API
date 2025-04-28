// src/middlewares/error.middleware.js

const errorHandler = (err, req, res, next) => {
    console.error('Error 💥:', err);
  
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong';
  
    res.status(statusCode).json({
      success: false,
      message: message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  module.exports = {
    errorHandler,
  };