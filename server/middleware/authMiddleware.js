// server/middleware/authMiddleware.js

import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      // It's better to send a JSON response for API consistency
      return res.json({ message: "Not authorized, token failed" });
    }
  }

  // if (!token) {
  //   res.status(401);
  //   throw new Error("Not authorized, no token");
  // }
  // FIX: This check runs if the 'if' block above is false
  if (!token) {
    // FIX: Return a JSON response instead of throwing an error
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }
};

// Use the modern 'export' syntax for named exports
export { protect };
