// server/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // 1. Get token from the request header
  const token = req.header("x-auth-token");

  // 2. Check if no token is present
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied." });
  }

  // 3. Verify the token
  try {
    // Decode the token using our secret key
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "a_super_secret_key_for_now"
    );

    // Add the user payload from the token to the request object
    req.user = decoded.user;

    // Call the next middleware or route handler
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid." });
  }
};
