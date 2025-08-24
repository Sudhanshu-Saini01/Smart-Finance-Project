// server/models/IncomeSource.js

// --- Dependency Imports ---
// Mongoose is the library we use to interact with our MongoDB database.
// It allows us to create schemas, which are like blueprints for our data.
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// --- Schema Definition ---
// This is the blueprint for a recurring income source. It defines the structure
// and data types for every income source document in the database.
const incomeSourceSchema = new Schema(
  {
    // This field links the income source to a specific user.
    // It is a direct reference to a document in the 'User' collection.
    // This dependency is crucial for fetching all income sources for a logged-in user.
    user: {
      type: Schema.Types.ObjectId, // Stores the unique ID of the user.
      ref: "User", // Specifies that this ID refers to a document in the 'User' collection.
      required: true, // Every income source must be associated with a user.
    },

    // The name of the income source, for example, "Monthly Salary" or "Freelance Project".
    sourceName: {
      type: String,
      required: true, // A name is mandatory.
      trim: true, // Removes any extra spaces from the beginning or end.
    },

    // The amount of money received from this source.
    amount: {
      type: Number,
      required: true,
    },

    // How often this income is received.
    frequency: {
      type: String,
      // 'enum' restricts this field to only accept one of the specified values.
      // This is important for the logic that will automatically create transactions.
      enum: ["weekly", "monthly", "yearly"],
      required: true,
    },

    // The date when this income source started or will start.
    startDate: {
      type: Date,
      default: Date.now, // If no date is provided, it defaults to the current date.
    },
  },
  {
    // This option automatically adds `createdAt` and `updatedAt` timestamps
    // to each document, which is useful for tracking when data is created or modified.
    timestamps: true,
  }
);

// --- Model Creation & Export ---
// This line compiles our schema blueprint into a usable 'IncomeSource' model.
// This model provides us with all the methods needed to create, read, update,
// and delete income sources in our database.
const IncomeSource = mongoose.model("IncomeSource", incomeSourceSchema);

// This makes the IncomeSource model available to be imported and used in other files,
// primarily in our upcoming API route file.
module.exports = IncomeSource;
