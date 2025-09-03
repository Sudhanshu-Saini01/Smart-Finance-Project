// server/middleware/adminMiddleware.js

import User from "../models/User.js";

// This middleware checks if the logged-in user is an admin.
// It MUST run AFTER the 'protect' middleware has run.
const admin = async (req, res, next) => {
  if (req.user && req.user.id) {
    try {
      const user = await User.findById(req.user.id);
      if (user && user.role === "admin") {
        next(); // User is an admin, proceed to the controller
      } else {
        res.status(403); // 403 Forbidden
        throw new Error("Not authorized as an admin");
      }
    } catch (error) {
      next(error);
    }
  } else {
    res.status(401); // 401 Unauthorized
    throw new Error("Not authorized, no user found");
  }
};

export { admin };
