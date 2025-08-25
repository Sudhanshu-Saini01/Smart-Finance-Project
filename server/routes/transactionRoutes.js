// server/routes/transactionRoutes.js
const express = require("express");
const router = express.Router();
const {
  getTransactions,
  createTransaction,
} = require("../controllers/transactionController");

console.log("✅ transactionRoutes.js file has been loaded by the server.");

router.route("/").get(getTransactions).post(createTransaction);

module.exports = router;
