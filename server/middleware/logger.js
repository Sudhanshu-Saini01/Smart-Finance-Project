// server/middleware/logger.js

const logger = (req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`➡️  [${timestamp}] ${req.method} ${req.originalUrl}`);
  next(); // Pass the request to the next handler
};

module.exports = logger;
