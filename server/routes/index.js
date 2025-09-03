// server/routes/index.js

import express from "express";
const router = express.Router();

import userRoutes from "./userRoutes.js";
import incomeSourceRoutes from "./incomeSourceRoutes.js";
import loanRoutes from "./loanRoutes.js";
import investmentRoutes from "./investmentRoutes.js";
import goalRoutes from "./goalRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import recurringRoutes from "./recurringRoutes.js";
import insuranceRoutes from "./insuranceRoutes.js";
import adminRoutes from "./adminRoutes.js";

router.use("/users", userRoutes);
router.use("/income-sources", incomeSourceRoutes);
router.use("/loans", loanRoutes);
router.use("/investments", investmentRoutes);
router.use("/goals", goalRoutes);
router.use("/transactions", transactionRoutes);
router.use("/recurrings", recurringRoutes);
router.use("/insurance", insuranceRoutes);
router.use("/admin", adminRoutes);

export default router;
