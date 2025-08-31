// // server/index.js

// const express = require("express");
// // const mongoose = require("mongoose");
// const cors = require("cors");
// // require("dotenv").config(); // Loads secret keys and config from a .env file.
// const dotenv = require("dotenv");

// // // Importing all custom API route handlers from the 'routes' folder.
// // const userRoutes = require("./routes/userRoutes");
// // const incomeSourceRoutes = require("./routes/incomeSourceRoutes");
// // // const insuranceRoutes = require("./routes/insuranceRoutes");
// // const loanRoutes = require("./routes/loanRoutes");
// // // const savingRoutes = require("./routes/savingRoutes");
// // const investmentRoutes = require("./routes/investmentRoutes");
// // const goalRoutes = require("./routes/goalRoutes");
// // const transactionRoutes = require("./routes/transactionRoutes");
// // const commitmentRoutes = require("./routes/commitmentRoutes");

// // --- New 26.08.2025 Custom Modules ---
// const connectDB = require("./config/db");
// const logger = require("./middleware/logger");
// const errorHandler = require("./middleware/errorHandler");
// const allRoutes = require("./routes/index"); //Centralized route handler

// // --- CONFIGURATION ---
// // Setting up the main variables for our application.
// // const app = express(); // Creates our main application server.
// // const PORT = process.env.PORT || 3001; // The "address" or "door number" our server will use.
// // const dbURI = process.env.DATABASE_URL; // The secret address for our database.

// // --- Configuration ---
// dotenv.config(); // Load environment variables from .env file
// connectDB(); // Establish database connection

// // --- Express App Initialization ---
// const app = express();
// const PORT = process.env.PORT || 3001;

// // --- MIDDLEWARE ---
// // These are like helpers that process every request before it reaches the route handlers.
// app.use(cors()); // Allows our front-end website to talk to this server, preventing security errors.
// app.use(express.json()); // Helps the server understand incoming data in JSON format.
// app.use(logger); // Log incoming requests for debugging

// // // --- DATABASE CONNECTION ---
// // // Connecting to our MongoDB database where all the app's data is stored.
// // mongoose
// //   .connect(dbURI)
// //   .then(() => console.log("MongoDB connected successfully! 💾"))
// //   .catch((err) => console.error("Error connecting to MongoDB:", err));

// // --- API Routes ---
// app.use("/api", allRoutes); // Mount all API routes under the '/api' prefix

// // // --- API ROUTES ---
// // // This section tells the server how to handle requests for different URLs.
// // // Each line connects a URL path (e.g., '/api/users') to its specific handler file.
// // app.use("/api/users", userRoutes);
// // app.use("/api/income-sources", incomeSourceRoutes);
// // // app.use("/api/insurances", insuranceRoutes);
// // app.use("/api/loans", loanRoutes);
// // // app.use("/api/savings", savingRoutes);
// // app.use("/api/investments", investmentRoutes);
// // app.use("/api/goals", goalRoutes);
// // app.use("/api/transactions", transactionRoutes);
// // app.use("/api/commitments", commitmentRoutes);

// // A simple test route for the main URL to confirm the server is working.
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to the Smart Finance Manager API! 🚀" });
// });

// // --- SERVER STARTUP ---
// app.listen(PORT, () => {
//   console.log(`Server is running successfully on http://localhost:${PORT}`);
// });

// server/index.js

// --- Core Node.js Imports ---
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path"; // Essential for serving the frontend in production

// --- Custom Module Imports ---
import connectDB from "./config/db.js";
import allRoutes from "./routes/index.js";
import logger from "./middleware/logger.js";
// Note: We will add errorHandler middleware later for more robust error handling

// --- Initialization ---
dotenv.config(); // Load environment variables from .env file
connectDB(); // Establish database connection
const app = express();
const PORT = process.env.PORT || 3001;

// --- Core Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow server to accept JSON in request body
app.use(logger); // Log incoming requests for debugging

// --- API Routes ---
// All API routes are prefixed with '/api'
app.use("/api", allRoutes);

// --- Deployment Configuration ---
// This section is crucial for deploying your full-stack application
if (process.env.NODE_ENV === "production") {
  // Sets the correct directory for ES Modules
  const __dirname = path.resolve();
  // Serve the static 'dist' folder from the client build
  app.use(express.static(path.join(__dirname, "/client/dist")));

  // For any request that doesn't match an API route, send the client's index.html file.
  // This allows React Router to handle the frontend routing.
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
  );
} else {
  // In development, the root route just confirms the API is running
  app.get("/", (req, res) => {
    res.json({ message: "Welcome to the WellPay API! 🚀" });
  });
}

// --- Server Startup ---
app.listen(PORT, () => {
  console.log(
    `✅ Server is running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
  );
});
