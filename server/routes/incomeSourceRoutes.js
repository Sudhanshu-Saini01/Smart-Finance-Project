// server/routes/incomeSourceRoutes.js
import express from "express";
import {
  getIncomeSources,
  createIncomeSource,
  deleteIncomeSource,
  updateIncomeSource,
} from "../controllers/incomeSourceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// This single line protects both the GET and POST routes.
// A user must be logged in to perform either action.
router
  .route("/")
  .get(protect, getIncomeSources)
  .post(protect, createIncomeSource);

// --- NEW: This handles DELETE requests to a specific ID, e.g., '/api/income-sources/some_id_123' ---
router
  .route("/:id")
  .put(protect, updateIncomeSource)
  .delete(protect, deleteIncomeSource);

export default router;
