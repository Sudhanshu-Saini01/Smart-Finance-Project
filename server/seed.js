// server/seed.js

const mongoose = require("mongoose");
// Note: bcrypt is no longer needed here, as the User model handles hashing.
const { faker } = require("@faker-js/faker");
require("dotenv").config();

// Model Imports
const User = require("./models/User");
const Transaction = require("./models/Transaction");
const Goal = require("./models/Goal");
const Commitment = require("./models/Commitment");
const Investment = require("./models/Investment");
const Loan = require("./models/Loan");
const IncomeSource = require("./models/IncomeSource");

const MONGODB_URI = process.env.DATABASE_URL;

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected for seeding...");

    console.log("🔥 Clearing ALL existing data...");
    await Promise.all([
      User.deleteMany({}),
      Transaction.deleteMany({}),
      Goal.deleteMany({}),
      Investment.deleteMany({}),
      Loan.deleteMany({}),
      Commitment.deleteMany({}),
      IncomeSource.deleteMany({}),
    ]);

    console.log("🌱 Creating 10 new users...");
    const users = [];
    const passwordToUse = "password123"; // The plain text password we will use.

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

    for (const name of indianNames) {
      // --- THIS IS THE FIX ---
      // We create a new user with the PLAIN TEXT password.
      // The User model's pre-save hook will automatically hash it upon saving.
      const user = new User({
        name: name,
        email: `${name.split(" ")[0].toLowerCase()}@example.com`,
        password: passwordToUse,
      });
      // The .save() command triggers the hashing middleware in User.js
      users.push(await user.save());
    }

    console.log(`✅ ${users.length} users created.`);
    console.log("\n--- ✅ LOGIN DETAILS FOR TEST USER ---");
    console.log(`Email: ${users[0].email}`);
    console.log(`Password: ${passwordToUse}`);
    console.log("---------------------------------------\n");

    console.log("📊 Generating financial history for each user...");
    for (const user of users) {
      // ... (The rest of the financial data generation is unchanged) ...
      const grossSalary = parseFloat(
        faker.finance.amount({ min: 50000, max: 150000, dec: 0 })
      );
      const netSalary = grossSalary * 0.85;
      await new IncomeSource({
        user: user._id,
        sourceName: "Monthly Salary",
        incomeType: "Salary",
        grossAmount: grossSalary,
        netAmount: netSalary,
        frequency: "monthly",
        startDate: faker.date.past({ years: 1 }),
      }).save();
      for (let i = 0; i < 12; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        await new Transaction({
          user: user._id,
          description: "Monthly Salary Credit",
          amount: netSalary,
          type: "income",
          category: "Salary",
          date: new Date(date.getFullYear(), date.getMonth(), 1),
        }).save();
      }
      for (let i = 0; i < 150; i++) {
        await new Transaction({
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
        }).save();
      }
    }
    console.log("✅ Financial history generated successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
};

seedDatabase();
