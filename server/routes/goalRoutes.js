// server/routes/goalRoutes.js

const express = require("express");
const router = express.Router();
const { getGoals, createGoal } = require("../controllers/goalController"); // Import the controller functions

// --- Define the Routes ---
// When a GET request comes to '/', use the getGoals controller.
router.route("/").get(getGoals);

// When a POST request comes to '/', use the createGoal controller.
router.route("/").post(createGoal);

module.exports = router;
