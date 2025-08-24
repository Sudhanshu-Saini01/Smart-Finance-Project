// server/routes/loanRoutes.js

// --- Dependency Imports ---
// This section imports all the necessary modules and models required for this route file.

// Express.js: The core framework used to create the server and router.
const express = require("express");
// Express Router: A part of Express that allows us to group related routes into a single file.
const router = express.Router();
// Auth Middleware: Our custom function to verify JWTs and protect routes, ensuring only logged-in users can access them.
const auth = require("../middleware/authMiddleware");
// Loan Model: The Mongoose model that defines the structure of a loan and provides methods to interact with the 'loans' collection in the database.
const Loan = require("../models/Loan");

// --- API Routes ---
// This section defines the specific endpoints for handling loan-related operations.

/**
 * @route   POST /api/loans
 * @desc    Add a new loan record for the authenticated user.
 * @access  Private (requires a valid token)
 */
router.post("/", auth, async (req, res) => {
  // The 'try...catch' block handles any potential errors during the database operation.
  try {
    // Destructures all the required loan details from the request body sent by the client.
    const {
      loanName,
      lender,
      loanType,
      assetType,
      totalAmount,
      emi,
      interestRate,
      startDate,
      endDate,
    } = req.body;

    // Creates a new instance of the Loan model with the provided data.
    // The user's ID is taken from the request object, which was added by the 'auth' middleware.
    const newLoan = new Loan({
      user: req.user.id,
      loanName,
      lender,
      loanType,
      assetType,
      totalAmount,
      emi,
      interestRate,
      startDate,
      endDate,
    });

    // Asynchronously saves the newly created loan document to the MongoDB database.
    const savedLoan = await newLoan.save();
    // Sends a 201 (Created) status code and the saved loan object back to the client as a JSON response.
    res.status(201).json(savedLoan);
  } catch (err) {
    // If an error occurs, it's logged to the server console for debugging.
    console.error(err.message);
    // Sends a 500 (Server Error) status code and a generic error message to the client.
    res.status(500).send("Server Error");
  }
});

/**
 * @route   GET /api/loans
 * @desc    Get all active loans for the authenticated user.
 * @access  Private (requires a valid token)
 */
router.get("/", auth, async (req, res) => {
  try {
    // Finds all loan documents in the database that match two criteria:
    // 1. The 'user' field matches the ID of the currently logged-in user.
    // 2. The 'status' field is exactly "active".
    // It then sorts the results by the 'endDate' in ascending order (1), so loans ending soonest appear first.
    const loans = await Loan.find({ user: req.user.id, status: "active" }).sort(
      { endDate: 1 }
    );
    // Sends the array of found loans back to the client as a JSON response.
    res.json(loans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- Module Export ---
// This line makes the router and its defined routes available for use in the main server file (index.js).
module.exports = router;
