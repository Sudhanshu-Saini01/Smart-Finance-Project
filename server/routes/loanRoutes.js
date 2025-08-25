// server/routes/loanRoutes.js
const express = require("express");
const router = express.Router();
const { getLoans, createLoan } = require("../controllers/loanController");

router.route("/").get(getLoans).post(createLoan);

module.exports = router;
