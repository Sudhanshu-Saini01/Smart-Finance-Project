// server/index.js

// --- 1. IMPORT THE TOOLS ---
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import the cors package
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes"); // Import transaction routes
const wishlistRoutes = require("./routes/wishlistRoutes"); // Import wishlist routes
const savingsRoutes = require("./routes/savingsRoutes"); // Import savings routes

// --- 2. INITIALIZE THE APP ---
const app = express();
const PORT = 3001;

// --- 3. MIDDLEWARE ---
app.use(cors()); // Use the cors middleware. This MUST be before the routes!
app.use(express.json());

// --- 4. CONNECT TO THE DATABASE ---
const dbURI = process.env.DATABASE_URL;
mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB connected successfully! 💾"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// --- 5. ROUTES ---
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes); // Use transaction routes
app.use("/api/wishlist", wishlistRoutes); // Use wishlist routes
app.use("/api/savings", savingsRoutes); // Use savings routes

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Smart Finance Manager API! 🚀" });
});

// --- 6. START THE SERVER ---
app.listen(PORT, () => {
  console.log(`Server is running successfully on http://localhost:${PORT}`);
});
