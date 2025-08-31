// server/controllers/userController.js

import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    next(error); // Pass the error to the error handling middleware)
    // // res.status(500).json({ message: "Server error" });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // --- 🐞 DEBUGGING LOGS START 🐞 ---
  console.log("--- LOGIN ATTEMPT ---");
  console.log(`1. Received login request for email: ${email}`);
  // --- 🐞 DEBUGGING LOGS END 🐞 ---

  try {
    const user = await User.findOne({ email }).select("+password");

    // --- 🐞 DEBUGGING LOGS START 🐞 ---
    if (!user) {
      console.log("2. ❌ User not found in database.");
    } else {
      console.log(`2. ✅ User found: ${user.name}`);
    }
    // --- 🐞 DEBUGGING LOGS END 🐞 ---

    if (user && (await user.matchPassword(password))) {
      // --- 🐞 DEBUGGING LOGS START 🐞 ---
      console.log("3. ✅ Password is correct!");
      console.log("----------------------");
      // --- 🐞 DEBUGGING LOGS END 🐞 ---

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      // --- 🐞 DEBUGGING LOGS START 🐞 ---
      console.log("3. ❌ Password does NOT match.");
      console.log("----------------------");
      // --- 🐞 DEBUGGING LOGS END 🐞 ---

      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    next(error);
    // console.error("LOGIN ERROR:", error); // Log the actual error on the server
    // res.status(500).json({ message: "Server error" });
  }
};

// New 26.08.2025
// --- Controller: Get User Profile ---
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    // The user object is attached to the request in the `protect` middleware
    const user = req.user;

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
