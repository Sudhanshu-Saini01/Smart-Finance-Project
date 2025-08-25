// server/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userController");

console.log("✅ userRoutes.js file has been loaded by the server.");

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
