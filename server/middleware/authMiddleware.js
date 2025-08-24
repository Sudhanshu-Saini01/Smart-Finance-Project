// server/middleware/authMiddleware.js

// --- IMPORTS ---
// We need the 'jsonwebtoken' library to verify the authenticity of the token.
const jwt = require("jsonwebtoken");

// --- MIDDLEWARE FUNCTION ---
/**
 * This function acts as a gatekeeper for protected routes.
 * It checks for a valid JSON Web Token (JWT) in the request header.
 * If the token is valid, it attaches the user's data to the request and passes it on.
 * If not, it sends back an authorization error.
 *
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The callback function to pass control to the next middleware.
 */
module.exports = function (req, res, next) {
  // 1. Get Token: Look for the token in the 'x-auth-token' header of the request.
  const token = req.header("x-auth-token");

  // 2. Check for Token's Existence: If no token is provided, deny access immediately.
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied." });
  }

  // 3. Verify Token: If a token exists, check if it's valid and not expired.
  try {
    // Decode the token using the secret key. This will throw an error if the token is invalid.
    // Note: Relying on `process.env.JWT_SECRET` is crucial for security. The fallback key should only be for emergencies or initial setup.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach User to Request: If verification is successful, attach the user's payload (e.g., their ID) to the request object.
    // This makes the user's information available to any subsequent route handlers.
    req.user = decoded.user;

    // 5. Proceed: Call 'next()' to pass control to the next function in the chain (the actual route handler).
    next();
  } catch (err) {
    // If jwt.verify fails (e.g., token is tampered with or expired), send an error.
    res.status(401).json({ message: "Token is not valid." });
  }
};
