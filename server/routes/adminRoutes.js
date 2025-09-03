// server/routes/adminRoutes.js

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";
import { simulateDeposit, getAllUsers  } from "../controllers/adminController.js";

const router = express.Router();

// // This is a test route to verify our admin security works.
// // It uses both 'protect' and 'admin' middleware.
// router.get("/test", protect, admin, (req, res) => {
//   res.json({ message: "Success! You have accessed an admin-only route." });
// });

// This route is protected by both 'protect' (logged in) and 'admin' (has admin role)
router.post("/simulate-deposit", protect, admin, simulateDeposit);

// --- NEW: Endpoint to get all users ---
router.get("/users", protect, admin, getAllUsers);

export default router;
