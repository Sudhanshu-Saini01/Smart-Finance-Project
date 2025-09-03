// server/routes/insuranceRoutes.js

import express from "express";
// We will create the controller for this later
// import { getInsurances } from '../controllers/insuranceController.js';
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// For now, we'll just have a placeholder route.
// We'll add the real controller function later.
router.route("/").get(protect, (req, res) => res.json([]));

export default router;
