// server/routes/goalRoutes.js
import express from "express";
import { getGoals, createGoal } from "../controllers/goalController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// This line defines and protects both GET and POST routes for /api/goals
router.route("/").get(protect, getGoals).post(protect, createGoal);

export default router;
