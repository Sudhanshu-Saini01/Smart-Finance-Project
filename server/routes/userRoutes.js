// server/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware"); // Import our guard

console.log("✅ userRoutes.js file has been loaded by the server.");

// --- User Routes ---
router.post("/signup", registerUser);
router.post("/login", loginUser);

// --- Protected Route ---
// The 'protect' middleware will run BEFORE getUserProfile
router.get("/profile", protect, getUserProfile);

module.exports = router;
