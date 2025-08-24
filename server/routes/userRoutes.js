// server/routes/userRoutes.js

// --- IMPORTS ---
// Bringing in the necessary tools and models for user-related actions.
const express = require("express");
const bcrypt = require("bcryptjs"); // For hashing and comparing passwords securely.
const jwt = require("jsonwebtoken"); // For creating secure web tokens for authentication.
const User = require("../models/User"); // The data model for a user.
const auth = require("../middleware/authMiddleware"); // Middleware to protect routes by checking for a valid token.

// Creates a new router object to handle user-specific requests.
const router = express.Router();

// --- ROUTES ---

/**
 * @route   POST /api/users/signup
 * @desc    Register a new user in the database.
 * @access  Public
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate Input: Check if all required fields are provided.
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, email, and password." });
    }

    // 2. Check for Existing User: Prevent duplicate accounts with the same email.
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // 3. Hash Password: Securely encrypt the user's password before saving.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create and Save New User: Create a new user instance and save it to the database.
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res
      .status(201)
      .json({ message: "User created successfully!", userId: newUser._id });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server error during user signup." });
  }
});

/**
 * @route   POST /api/users/login
 * @desc    Authenticate an existing user and return a JWT (JSON Web Token).
 * @access  Public
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate Input: Ensure both email and password are provided.
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password." });
    }

    // 2. Find User: Check if a user with the given email exists.
    const user = await User.findOne({ email });
    if (!user) {
      // Use a generic message for security to not reveal which field was wrong.
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // 3. Compare Passwords: Check if the provided password matches the hashed password in the database.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // 4. Generate Token: Create a JWT that the user can use for future authenticated requests.
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // The secret key for signing the token.
      { expiresIn: "1h" }, // The token will be valid for 1 hour.
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ message: "Login successful!", token: token });
      }
    );
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error during user login." });
  }
});

/**
 * @route   GET /api/users/profile
 * @desc    Fetch the profile information of the currently logged-in user.
 * @access  Private (Requires a valid token)
 */
router.get("/profile", auth, async (req, res) => {
  try {
    // The 'auth' middleware has already verified the token and added the user's id to the request object.
    // We fetch the user from the database but exclude the password for security.
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- EXPORT ---
// Makes the router available for use in the main server file (index.js).
module.exports = router;
