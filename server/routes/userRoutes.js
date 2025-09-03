// server/routes/userRoutes.js

import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

console.log("✅ userRoutes.js file has been loaded by the server.");

// --- User Routes ---
router.post("/signup", registerUser);
router.post("/login", loginUser);

// --- Protected Route ---
// The 'protect' middleware will run BEFORE getUserProfile
router.get("/profile", protect, getUserProfile);

export default router;
