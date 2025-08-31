// server/routes/index.js

import express from "express";
const router = express.Router();

// Import individual route files using the 'import' syntax
import userRoutes from "./userRoutes.js";
import incomeSourceRoutes from "./incomeSourceRoutes.js";
import loanRoutes from "./loanRoutes.js";
import investmentRoutes from "./investmentRoutes.js";
import goalRoutes from "./goalRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import commitmentRoutes from "./commitmentRoutes.js";

// Mount the imported routes (this part is unchanged)
router.use("/users", userRoutes);
router.use("/income-sources", incomeSourceRoutes);
router.use("/loans", loanRoutes);
router.use("/investments", investmentRoutes);
router.use("/goals", goalRoutes);
router.use("/transactions", transactionRoutes);
router.use("/commitments", commitmentRoutes);

// Use 'export default' for ES Modules
export default router;
