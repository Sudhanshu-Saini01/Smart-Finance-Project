// server/index.js

// --- Core Imports ---
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// --- Custom Module Imports ---
import connectDB from "./config/db.js";
import allRoutes from "./routes/index.js";
import logger from "./middleware/logger.js";
// We should add a global error handler for a truly professional app
import errorHandler from "./middleware/errorHandler.js";

// --- Initialization ---
dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 3001;

// --- Core Middleware ---
app.use(cors());
app.use(express.json());
app.use(logger);

// --- API Routes ---
app.use("/api", allRoutes);

// --- Production Deployment Configuration ---
// if (process.env.NODE_ENV === "production") {
//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);

//   // The path needs to go up one directory from /server to find the /client/dist folder
//   app.use(express.static(path.join(__dirname, "../client/dist")));

//   // For any non-API request, serve the main index.html file
//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname, "../", "client", "dist", "index.html"))
//   );
// } else {
//   // A simple root route for development mode
//   app.get("/", (req, res) => {
//     res.json({ message: "Welcome to the WellPay API! Development Mode" });
//   });
// }

// Global error handler should be the last piece of middleware
app.use(errorHandler);

// --- Server Startup ---
app.listen(PORT, () => {
  console.log(
    `✅ Server is running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});
