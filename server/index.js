// server/index.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

// /----- VERSION V2 -----/
const goalRoutes = require("./routes/goalRoutes");
const investmentRoutes = require("./routes/investmentRoutes");
const loanRoutes = require("./routes/loanRoutes");
// /----- END VERSION V2 -----/

//-------- Start: Version V3.0.0---------//
const commitmentRoutes = require("./routes/commitmentRoutes"); // Add this line
//-------- End: Version V3.0.0---------//

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const dbURI = process.env.DATABASE_URL;
mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB connected successfully! 💾"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);

// /----- VERSION V2 -----/
// The old wishlist and savings routes are now replaced by these.
app.use("/api/goals", goalRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/loans", loanRoutes);
// /----- END VERSION V2 -----/

//-------- Start: Version V3.0.0---------//
app.use("/api/commitments", commitmentRoutes); // Add this line
//-------- End: Version V3.0.0---------//

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Smart Finance Manager API! 🚀" });
});

app.listen(PORT, () => {
  console.log(`Server is running successfully on http://localhost:${PORT}`);
});
