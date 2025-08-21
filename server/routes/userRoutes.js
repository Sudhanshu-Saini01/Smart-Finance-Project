// server/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // For hashing passwords
const jwt = require("jsonwebtoken"); // For creating tokens
const User = require("../models/User"); // Import our User model
const auth = require("../middleware/authMiddleware");

// --- SIGNUP ROUTE (NOW WITH HASHING) ---
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, email and password." });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10); // Generate a "salt" for hashing
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Save the hashed password, not the original
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

// --- LOGIN ROUTE (NOW WITH HASHING CHECK & JWT) ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // If passwords match, create a JWT
    const payload = {
      user: {
        id: user.id, // We'll use the user's database ID in the token
      },
    };

    // Sign the token with a secret key
    // This secret should be in your .env file in a real app!
    jwt.sign(
      payload,
      process.env.JWT_SECRET || "a_super_secret_key_for_now", // Fallback secret
      { expiresIn: "1h" }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        // Send the token back to the user
        res.status(200).json({ message: "Login successful!", token: token });
      }
    );
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error during user login." });
  }
});

// --- PROTECTED ROUTE EXAMPLE ---
// We add our auth middleware as the second argument.
// It will run BEFORE the main route logic.
// const auth = require("../middleware/authMiddleware");

router.get("/profile", auth, async (req, res) => {
  try {
    // Because our middleware ran, req.user is now available.
    // We can get the user's data from the database without the password.
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
