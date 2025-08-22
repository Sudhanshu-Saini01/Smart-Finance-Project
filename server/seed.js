// server/seed.js
//-------- Start: Version V3.0.0---------//

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");
require("dotenv").config();

// Import all of our V3 models
const User = require("./models/User");
const Transaction = require("./models/Transaction");
const Goal = require("./models/Goal");
const Investment = require("./models/Investment");
const Loan = require("./models/Loan");
const Commitment = require("./models/Commitment");

const MONGODB_URI = process.env.DATABASE_URL;

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected for V3 seeding...");

    console.log("Clearing ALL existing data...");
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await Goal.deleteMany({});
    await Investment.deleteMany({});
    await Loan.deleteMany({});
    await Commitment.deleteMany({});

    console.log("Creating 10 new users with Indian names...");
    const users = [];
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

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

    console.log("Generating detailed financial history for each user...");
    for (const user of users) {
      // Create 2-3 recurring commitments for each user
      const commitments = [];
      // Savings Commitment
      const rdCommitment = new Commitment({
        user: user._id,
        commitmentName: "Monthly Recurring Deposit",
        amount: parseFloat(
          faker.finance.amount({ min: 2000, max: 8000, dec: 0 })
        ),
        commitmentType: "savings",
        paymentDay: 5,
      });
      commitments.push(await rdCommitment.save());

      // Investment Commitment
      const sipCommitment = new Commitment({
        user: user._id,
        commitmentName: "Equity Mutual Fund SIP",
        amount: parseFloat(
          faker.finance.amount({ min: 5000, max: 15000, dec: 0 })
        ),
        commitmentType: "investment",
        paymentDay: 10,
      });
      commitments.push(await sipCommitment.save());

      // Create a Goal and link a commitment to it
      const goal = new Goal({
        user: user._id,
        goalName: `Save for ${faker.commerce.product()}`,
        targetAmount: parseFloat(
          faker.finance.amount({ min: 100000, max: 1000000, dec: 0 })
        ),
        goalType: "item",
        imageUrl: faker.image.urlLoremFlickr({ category: "travel" }),
        priority: "high",
        linkedCommitment: rdCommitment._id, // Link the RD to this goal
      });
      await goal.save();

      // Generate 12 months of income, which will trigger the automation
      for (let i = 0; i < 12; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const incomeTx = new Transaction({
          user: user._id,
          description: "Monthly Salary",
          amount: parseFloat(
            faker.finance.amount({ min: 50000, max: 150000, dec: 0 })
          ),
          type: "income",
          category: "Salary",
          date: new Date(date.getFullYear(), date.getMonth(), 1), // First day of the month
        });
        await incomeTx.save();

        // Manually trigger the automation logic from our backend for the seed
        for (const commitment of commitments) {
          const commitmentTx = new Transaction({
            user: user._id,
            description: commitment.commitmentName,
            amount: commitment.amount,
            type: commitment.commitmentType,
            category: "Recurring Commitment",
            date: new Date(
              date.getFullYear(),
              date.getMonth(),
              commitment.paymentDay
            ),
          });
          await commitmentTx.save();
          if (commitment.linkedGoal) {
            await Goal.findByIdAndUpdate(commitment.linkedGoal, {
              $inc: { currentAmount: commitment.amount },
            });
          }
        }
      }

      // Generate 80 random, non-recurring expenses
      for (let i = 0; i < 80; i++) {
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
          occurrence: "one-time",
        });
        await expense.save();
      }
    }
    console.log("V3 financial history generated successfully!");

    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  } catch (error) {
    console.error("Error seeding V3 database:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
//-------- End: Version V3.0.0---------//
