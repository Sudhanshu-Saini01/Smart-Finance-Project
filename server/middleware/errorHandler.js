// server/middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  // Determine the status code, default to 500 if not set
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Log the error for the developer (in development mode)
  console.error(`❌ [ERROR] ${err.message}`);
  console.error(err.stack);

  // Send a clean, user-friendly error response
  res.json({
    message: err.message,
    // Only show the stack trace in development mode for security reasons
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;
