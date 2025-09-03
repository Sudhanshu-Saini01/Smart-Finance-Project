// server/controllers/userController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { createSampleDataForUser } from "../utils/sampleDataHelper.js";

// A single, reliable list of special emails that will get sample data upon registration.
const testUserEmails = [
  "test1@example.com",
  "test2@example.com",
  "test3@example.com",
];

// Helper function to generate the JSON Web Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

/**
 * @desc    Register a new user. If the email is a special test email,
 * it also creates a full set of sample data for them.
 * @route   POST /api/users/signup
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      // --- FINAL LOGIC ---
      // Check if the newly registered user's email is in our special test list.
      if (testUserEmails.includes(user.email)) {
        // If it is, call our helper to create the full suite of sample data.
        await createSampleDataForUser(user._id);
      }
      // --- END OF FINAL LOGIC ---

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
    next(error);
  }
};

/**
 * @desc    Authenticate a user and get a token.
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get the profile of the logged-in user.
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res, next) => {
  try {
    // The user object is attached to the request by our 'protect' middleware
    const user = await User.findById(req.user.id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    next(error);
  }
};

// Use the modern ES Module export syntax
export { registerUser, loginUser, getUserProfile };
