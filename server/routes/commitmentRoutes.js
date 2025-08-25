// server/routes/commitmentRoutes.js
const express = require("express");
const router = express.Router();
const {
  getCommitments,
  createCommitment,
} = require("../controllers/commitmentController");

router.route("/").get(getCommitments).post(createCommitment);

module.exports = router;
