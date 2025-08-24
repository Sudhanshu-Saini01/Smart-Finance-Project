// server/routes/incomeSourceRoutes.js

// --- Dependency Imports ---
// Express is the web framework used to create the router.
const express = require("express");
// The Router is a part of Express that helps organize API endpoints into separate files.
const router = express.Router();
// This is our custom middleware that checks for a valid JSON Web Token to protect our routes.
// It's a crucial dependency for ensuring only logged-in users can access these endpoints.
const auth = require("../middleware/authMiddleware");
// This imports the Mongoose model we just created. It's the dependency that allows us to
// interact with the 'incomesources' collection in our MongoDB database.
const IncomeSource = require("../models/IncomeSource");

// --- API Routes ---

/**
 * @route   POST /api/income-sources
 * @desc    Create a new recurring income source for the logged-in user.
 * @access  Private (requires a valid token)
 */
// The `auth` middleware is placed before the main route logic. It will run first,
// and if the user is not authenticated, it will stop the request from proceeding.
router.post("/", auth, async (req, res) => {
  // A `try...catch` block is used to handle any potential errors that might occur
  // during the database operation, preventing the server from crashing.
  try {
    // We destructure the expected data from the request's body.
    const { sourceName, amount, frequency, startDate } = req.body;

    // A new instance of the IncomeSource model is created with the data from the request.
    // `req.user.id` is made available by our `auth` middleware after it decodes the token.
    const newIncomeSource = new IncomeSource({
      user: req.user.id,
      sourceName,
      amount,
      frequency,
      startDate,
    });

    // The `.save()` method asynchronously saves the new document to the database.
    const savedIncomeSource = await newIncomeSource.save();

    // If the save is successful, the server sends back a 201 (Created) status
    // and the newly created document as a JSON response.
    res.status(201).json(savedIncomeSource);
  } catch (err) {
    // If an error occurs, it's logged to the server's console for debugging.
    console.error(err.message);
    // A generic 500 (Internal Server Error) status is sent back to the client.
    res.status(500).send("Server Error");
  }
});

/**
 * @route   GET /api/income-sources
 * @desc    Get all recurring income sources for the logged-in user.
 * @access  Private (requires a valid token)
 */
router.get("/", auth, async (req, res) => {
  try {
    // The `.find()` method queries the database for all documents that match the given criteria.
    // Here, it finds all income sources where the 'user' field matches the logged-in user's ID.
    // `.sort({ createdAt: -1 })` organizes the results to show the most recently created sources first.
    const incomeSources = await IncomeSource.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    // The server sends back the array of found income sources as a JSON response.
    res.json(incomeSources);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- Module Export ---
// This line makes the router and its defined endpoints available to be used in our main `index.js` server file.
module.exports = router;
