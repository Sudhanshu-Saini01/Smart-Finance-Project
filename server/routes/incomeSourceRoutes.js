// server/routes/incomeSourceRoutes.js
const express = require("express");
const router = express.Router();
const {
  getIncomeSources,
  createIncomeSource,
} = require("../controllers/incomeSourceController");

router.route("/").get(getIncomeSources).post(createIncomeSource);

module.exports = router;
