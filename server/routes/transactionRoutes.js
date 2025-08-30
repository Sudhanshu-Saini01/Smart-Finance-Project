// server/routes/transactionRoutes.js
const express = require("express");
const router = express.Router();
const {
  getTransactions,
  createTransaction,
  getMonthlySummary,
} = require("../controllers/transactionController");

console.log("✅ transactionRoutes.js file has been loaded by the server.");

// --- NEW: Define the route for the monthly summary ---
// This route must be defined BEFORE any routes with parameters like '/:id'
router.get("/monthly-summary", getMonthlySummary);

// Existing routes for getting all transactions and creating one
router.route("/").get(getTransactions).post(createTransaction);

module.exports = router;
