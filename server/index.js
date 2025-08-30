// server/index.js

const express = require("express");
// const mongoose = require("mongoose");
const cors = require("cors");
// require("dotenv").config(); // Loads secret keys and config from a .env file.
const dotenv = require("dotenv");

// // Importing all custom API route handlers from the 'routes' folder.
// const userRoutes = require("./routes/userRoutes");
// const incomeSourceRoutes = require("./routes/incomeSourceRoutes");
// // const insuranceRoutes = require("./routes/insuranceRoutes");
// const loanRoutes = require("./routes/loanRoutes");
// // const savingRoutes = require("./routes/savingRoutes");
// const investmentRoutes = require("./routes/investmentRoutes");
// const goalRoutes = require("./routes/goalRoutes");
// const transactionRoutes = require("./routes/transactionRoutes");
// const commitmentRoutes = require("./routes/commitmentRoutes");

// --- New 26.08.2025 Custom Modules ---
const connectDB = require("./config/db");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const allRoutes = require("./routes/index"); //Centralized route handler

// --- CONFIGURATION ---
// Setting up the main variables for our application.
// const app = express(); // Creates our main application server.
// const PORT = process.env.PORT || 3001; // The "address" or "door number" our server will use.
// const dbURI = process.env.DATABASE_URL; // The secret address for our database.

// --- Configuration ---
dotenv.config(); // Load environment variables from .env file
connectDB(); // Establish database connection

// --- Express App Initialization ---
const app = express();
const PORT = process.env.PORT || 3001;

// --- MIDDLEWARE ---
// These are like helpers that process every request before it reaches the route handlers.
app.use(cors()); // Allows our front-end website to talk to this server, preventing security errors.
app.use(express.json()); // Helps the server understand incoming data in JSON format.
app.use(logger); // Log incoming requests for debugging

// // --- DATABASE CONNECTION ---
// // Connecting to our MongoDB database where all the app's data is stored.
// mongoose
//   .connect(dbURI)
//   .then(() => console.log("MongoDB connected successfully! 💾"))
//   .catch((err) => console.error("Error connecting to MongoDB:", err));

// --- API Routes ---
app.use("/api", allRoutes); // Mount all API routes under the '/api' prefix

// // --- API ROUTES ---
// // This section tells the server how to handle requests for different URLs.
// // Each line connects a URL path (e.g., '/api/users') to its specific handler file.
// app.use("/api/users", userRoutes);
// app.use("/api/income-sources", incomeSourceRoutes);
// // app.use("/api/insurances", insuranceRoutes);
// app.use("/api/loans", loanRoutes);
// // app.use("/api/savings", savingRoutes);
// app.use("/api/investments", investmentRoutes);
// app.use("/api/goals", goalRoutes);
// app.use("/api/transactions", transactionRoutes);
// app.use("/api/commitments", commitmentRoutes);

// A simple test route for the main URL to confirm the server is working.
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Smart Finance Manager API! 🚀" });
});

// --- SERVER STARTUP ---
app.listen(PORT, () => {
  console.log(`Server is running successfully on http://localhost:${PORT}`);
});
