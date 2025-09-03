// server/routes/loanRoutes.js
import express from "express";
import { getLoans, createLoan } from "../controllers/loanController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// This one line defines both routes and protects them.
// GET requests to / will run getLoans.
// POST requests to / will run createLoan.
router.route("/").get(protect, getLoans).post(protect, createLoan);

export default router;
