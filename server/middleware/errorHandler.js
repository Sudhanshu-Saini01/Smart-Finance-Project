// // server/middleware/errorHandler.js

// const errorHandler = (err, req, res, next) => {
//   // Determine the status code, default to 500 if not set
//   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//   res.status(statusCode);

//   // Log the error for the developer (in development mode)
//   console.error(`❌ [ERROR] ${err.message}`);
//   console.error(err.stack);

//   // Send a clean, user-friendly error response
//   res.json({
//     message: err.message,
//     // Only show the stack trace in development mode for security reasons
//     stack: process.env.NODE_ENV === "production" ? null : err.stack,
//   });
// };

// export { errorHandler };

// server/middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  // If a status code has already been set, use it. Otherwise, default to 500 (Internal Server Error).
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  // Send a clean, structured JSON response.
  res.json({
    message: err.message,
    // The stack trace is only included for debugging in non-production environments.
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

// Use the modern 'export' syntax
export default errorHandler;
