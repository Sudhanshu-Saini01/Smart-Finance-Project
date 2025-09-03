// server/routes/investmentRoutes.js
import express from "express";
import {
  getInvestments,
  createInvestment,
} from "../controllers/investmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// This line defines and protects both GET and POST routes for /api/investments
router.route("/").get(protect, getInvestments).post(protect, createInvestment);

export default router;
