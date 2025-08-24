// server/index.js

// --- IMPORTS ---
// Bringing in the tools we need for our server.
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Loads secret keys and config from a .env file.

// Importing our custom API route handlers from the 'routes' folder.
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const goalRoutes = require("./routes/goalRoutes");
const investmentRoutes = require("./routes/investmentRoutes");
const loanRoutes = require("./routes/loanRoutes");
const commitmentRoutes = require("./routes/commitmentRoutes");
// ===================================================================
// == UPDATE: 2025-08-23 | Add Income Source Feature ==
// This new line imports the route handler for our dedicated income source system.
const incomeSourceRoutes = require("./routes/incomeSourceRoutes");
// ===================================================================

// --- INITIALIZATION & CONFIGURATION ---
// Setting up the main variables for our application.
const app = express(); // Creates our main application server.
const PORT = 3001; // The "address" or "door number" our server will use.
const dbURI = process.env.DATABASE_URL; // The secret address for our database.

// --- MIDDLEWARE ---
// These are like helpers that process every request before it reaches the route handlers.
app.use(cors()); // Allows our front-end website to talk to this server, preventing security errors.
app.use(express.json()); // Helps the server understand incoming data in JSON format.

// --- DATABASE CONNECTION ---
// Connecting to our MongoDB database where all the app's data is stored.
mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB connected successfully! 💾"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// --- API ROUTES ---
// This section tells the server how to handle requests for different URLs.
// Each line connects a URL path (e.g., '/api/users') to its specific handler file.
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/commitments", commitmentRoutes);
// ===================================================================
// == UPDATE: 2025-08-23 | Add Income Source Feature ==
// This new line tells our server to use the incomeSourceRoutes for any
// request that starts with '/api/income-sources'.
app.use("/api/income-sources", incomeSourceRoutes);
// ===================================================================

// A simple test route for the main URL to confirm the server is working.
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Smart Finance Manager API! 🚀" });
});

// --- SERVER STARTUP ---
// This command officially starts the server, making it ready to listen for requests.
app.listen(PORT, () => {
  console.log(`Server is running successfully on http://localhost:${PORT}`);
});
