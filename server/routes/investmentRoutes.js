// server/routes/investmentRoutes.js
const express = require("express");
const router = express.Router();
const {
  getInvestments,
  createInvestment,
} = require("../controllers/investmentController");

router.route("/").get(getInvestments).post(createInvestment);

module.exports = router;
