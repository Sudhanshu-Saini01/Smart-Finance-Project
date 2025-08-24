// server/seed.js

// --- Dependency Imports ---
// Mongoose for database connection and data modeling.
const mongoose = require("mongoose");
// Bcryptjs for securely hashing user passwords.
const bcrypt = require("bcryptjs");
// Faker for generating realistic placeholder data (names, emails, financial amounts, etc.).
const { faker } = require("@faker-js/faker");
// Dotenv to load environment variables like the database URI from a .env file.
require("dotenv").config();

// --- Model Imports ---
// Importing all the data blueprints needed to create new documents in the database.
const User = require("./models/User");
const Transaction = require("./models/Transaction");
const Goal = require("./models/Goal");
const Commitment = require("./models/Commitment");
const Investment = require("./models/Investment");
const Loan = require("./models/Loan");
// ===================================================================
// == UPDATE: 2025-08-23 | Add Income Source Feature ==
// This new line imports our new IncomeSource model.
const IncomeSource = require("./models/IncomeSource");
// ===================================================================

// --- Database Configuration ---
// Retrieves the database connection string from environment variables.
const MONGODB_URI = process.env.DATABASE_URL;

/**
 * @function seedDatabase
 * @desc     A script to completely wipe and then repopulate the database with
 * a fresh set of realistic, fake data for testing and development.
 */
const seedDatabase = async () => {
  try {
    // 1. Connect to the database.
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected for seeding...");

    // 2. Clear all existing data from the collections to ensure a fresh start.
    console.log("Clearing ALL existing data...");
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await Goal.deleteMany({});
    await Investment.deleteMany({});
    await Loan.deleteMany({});
    await Commitment.deleteMany({});
    // ===================================================================
    // == UPDATE: 2025-08-23 | Add Income Source Feature ==
    // This new line ensures the incomesources collection is also cleared.
    await IncomeSource.deleteMany({});
    // ===================================================================

    // 3. Create a batch of new users.
    console.log("Creating 10 new users with Indian names...");
    const users = [];
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt); // All users get the same default password.

    const indianNames = [
      "Aarav Sharma",
      "Vivaan Singh",
      "Aditya Kumar",
      "Vihaan Gupta",
      "Arjun Patel",
      "Saanvi Sharma",
      "Aanya Singh",
      "Aadhya Kumar",
      "Aaradhya Gupta",
      "Ananya Patel",
    ];

    for (let i = 0; i < 10; i++) {
      const user = new User({
        name: indianNames[i],
        email: faker.internet.email({
          firstName: indianNames[i].split(" ")[0],
        }),
        password: hashedPassword,
      });
      users.push(await user.save());
    }
    console.log(`${users.length} users created.`);

    // 4. Generate a detailed financial history for each created user.
    console.log("Generating detailed financial history for each user...");
    for (const user of users) {
      // Create a recurring deposit commitment.
      const rdCommitment = new Commitment({
        user: user._id,
        commitmentName: "Monthly Recurring Deposit",
        amount: parseFloat(
          faker.finance.amount({ min: 2000, max: 8000, dec: 0 })
        ),
        commitmentType: "savings",
        frequency: "monthly",
        startDate: faker.date.past({ years: 1 }),
      });
      await rdCommitment.save();

      // Create a mutual fund SIP commitment.
      const sipCommitment = new Commitment({
        user: user._id,
        commitmentName: "Equity Mutual Fund SIP",
        amount: parseFloat(
          faker.finance.amount({ min: 5000, max: 15000, dec: 0 })
        ),
        commitmentType: "investment",
        frequency: "monthly",
        startDate: faker.date.past({ years: 1 }),
      });
      await sipCommitment.save();

      // Create a financial goal and link it to the recurring deposit.
      const goal = new Goal({
        user: user._id,
        goalName: `Save for ${faker.commerce.product()}`,
        targetAmount: parseFloat(
          faker.finance.amount({ min: 100000, max: 1000000, dec: 0 })
        ),
        goalType: "item",
        imageUrl: faker.image.urlLoremFlickr({ category: "travel" }),
        priority: "high",
        linkedCommitment: rdCommitment._id, // Links this goal to the RD commitment.
      });
      await goal.save();

      // // Generate 12 months of salary income transactions.
      // for (let i = 0; i < 12; i++) {
      //   const date = new Date();
      //   date.setMonth(date.getMonth() - i);
      //   const incomeTx = new Transaction({
      //     user: user._id,
      //     description: "Monthly Salary",
      //     amount: parseFloat(
      //       faker.finance.amount({ min: 50000, max: 150000, dec: 0 })
      //     ),
      //     type: "income",
      //     category: "Salary",
      //     date: new Date(date.getFullYear(), date.getMonth(), 1),
      //   });
      //   await incomeTx.save();
      // }

      // ===================================================================
      // == UPDATE: 2025-08-23 | Add Income Source Feature ==
      // Instead of creating income transactions directly, we now create a single,
      // recurring IncomeSource for each user's salary.
      const salaryAmount = parseFloat(
        faker.finance.amount({ min: 50000, max: 150000, dec: 0 })
      );
      const incomeSource = new IncomeSource({
        user: user._id,
        sourceName: "Monthly Salary",
        amount: salaryAmount,
        frequency: "monthly",
        startDate: faker.date.past({ years: 1 }),
      });
      await incomeSource.save();

      // We still generate 12 months of past income TRANSACTIONS to create a realistic
      // history for the user to view when they first log in.
      for (let i = 0; i < 12; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const incomeTx = new Transaction({
          user: user._id,
          description: "Monthly Salary",
          amount: salaryAmount,
          type: "income",
          category: "Salary",
          date: new Date(date.getFullYear(), date.getMonth(), 1),
        });
        await incomeTx.save();
      }
      // ===================================================================

      // Generate 150 random expense transactions over the last year.
      for (let i = 0; i < 150; i++) {
        const expense = new Transaction({
          user: user._id,
          description: faker.commerce.productName(),
          amount: parseFloat(
            faker.finance.amount({ min: 100, max: 5000, dec: 2 })
          ),
          type: "expense",
          category: faker.helpers.arrayElement([
            "Groceries",
            "Utilities",
            "Transport",
            "Entertainment",
            "Other",
          ]),
          date: faker.date.past({ years: 1 }),
        });
        await expense.save();
      }
    }
    console.log("Financial history generated successfully!");

    // 5. Disconnect from the database after the script is finished.
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  } catch (error) {
    // If any error occurs during the process, log it and exit.
    console.error("Error seeding database:", error);
    await mongoose.disconnect();
    process.exit(1); // Exit with a failure code.
  }
};

// 6. Execute the seeding function.
seedDatabase();
