// server/routes/index.js

const express = require("express");
const router = express.Router();

// Import individual route files
const userRoutes = require("./userRoutes");
const incomeSourceRoutes = require("./incomeSourceRoutes");
const loanRoutes = require("./loanRoutes");
const investmentRoutes = require("./investmentRoutes");
const goalRoutes = require("./goalRoutes");
const transactionRoutes = require("./transactionRoutes");
const commitmentRoutes = require("./commitmentRoutes");

// Mount the imported routes
router.use("/users", userRoutes);
router.use("/income-sources", incomeSourceRoutes);
router.use("/loans", loanRoutes);
router.use("/investments", investmentRoutes);
router.use("/goals", goalRoutes);
router.use("/transactions", transactionRoutes);
router.use("/commitments", commitmentRoutes);

module.exports = router;
