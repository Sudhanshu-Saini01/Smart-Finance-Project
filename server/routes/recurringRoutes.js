// server/routes/recurringRoutes.js
import express from "express";
import {
  getRecurrings,
  createRecurring,
} from "../controllers/recurringController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes here are protected and will require a valid token
router.route("/").get(protect, getRecurrings).post(protect, createRecurring);

export default router;
