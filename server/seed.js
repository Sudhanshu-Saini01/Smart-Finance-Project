// server/seed.js
// /----- VERSION V2 -----/

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");
require("dotenv").config();

// Import all of our V2 models
const User = require("./models/User");
const Transaction = require("./models/Transaction");
const Goal = require("./models/Goal");
const Investment = require("./models/Investment");
const Loan = require("./models/Loan");

const MONGODB_URI = process.env.DATABASE_URL;

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected for V2 seeding...");

    console.log("Clearing ALL existing data...");
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await Goal.deleteMany({});
    await Investment.deleteMany({});
    await Loan.deleteMany({});

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
        unallocatedSavings: 0,
        unallocatedInvestments: 0,
      });
      users.push(await user.save());
    }
    console.log(`${users.length} users created.`);

    console.log("Generating detailed financial history for each user...");
    for (const user of users) {
      let tempUnallocatedSavings = 0;
      let tempUnallocatedInvestments = 0;

      // Generate 12 months of income and auto-allocate to pools
      for (let i = 0; i < 12; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const incomeAmount = parseFloat(
          faker.finance.amount({ min: 40000, max: 120000, dec: 0 })
        );

        const incomeTx = new Transaction({
          user: user._id,
          description: "Monthly Salary",
          amount: incomeAmount,
          type: "income",
          category: "Salary",
          date: date,
        });
        await incomeTx.save();

        tempUnallocatedSavings +=
          incomeAmount * (user.allocations.savings / 100);
        tempUnallocatedInvestments +=
          incomeAmount * (user.allocations.investment / 100);
      }

      // Generate 100 random expenses
      for (let i = 0; i < 100; i++) {
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

      // Generate 2-3 real investments from the investment pool
      for (let i = 0; i < 2; i++) {
        if (tempUnallocatedInvestments > 20000) {
          const amountToInvest = parseFloat(
            faker.finance.amount({
              min: 10000,
              max: tempUnallocatedInvestments / 2,
              dec: 0,
            })
          );
          const investment = new Investment({
            user: user._id,
            investmentName: `${faker.helpers.arrayElement([
              "ICICI Prudential",
              "HDFC",
              "SBI",
              "Axis",
            ])} ${faker.helpers.arrayElement([
              "Bluechip",
              "MidCap",
              "Index",
            ])} Fund`,
            investmentType: "Mutual Fund",
            amountInvested: amountToInvest,
            expectedRoi: parseFloat(
              faker.finance.amount({ min: 8, max: 15, dec: 1 })
            ),
          });
          await investment.save();
          tempUnallocatedInvestments -= amountToInvest;
        }
      }

      // Generate 2-3 goals
      for (let i = 0; i < 2; i++) {
        const goal = new Goal({
          user: user._id,
          goalName: `Fund for ${faker.commerce.product()}`,
          targetAmount: parseFloat(
            faker.finance.amount({ min: 50000, max: 1500000, dec: 0 })
          ),
          goalType: "item",
          imageUrl: faker.image.urlLoremFlickr({ category: "technics" }),
          priority: faker.helpers.arrayElement(["high", "medium", "low"]),
        });
        await goal.save();
      }

      // Generate 1-2 loans for some users
      if (Math.random() > 0.5) {
        const loanType = faker.helpers.arrayElement([
          "vehicle",
          "home",
          "personal",
        ]);
        const assetType =
          loanType === "home"
            ? "appreciating"
            : loanType === "vehicle"
            ? "depreciating"
            : "neutral";
        const totalAmount = parseFloat(
          faker.finance.amount({ min: 100000, max: 2500000, dec: 0 })
        );
        const loan = new Loan({
          user: user._id,
          loanName: `${
            loanType.charAt(0).toUpperCase() + loanType.slice(1)
          } Loan`,
          lender: `${faker.helpers.arrayElement([
            "HDFC Bank",
            "SBI",
            "ICICI Bank",
            "Bajaj Finserv",
          ])}`,
          loanType: loanType,
          assetType: assetType,
          totalAmount: totalAmount,
          amountPaid: parseFloat(
            faker.finance.amount({ min: 10000, max: totalAmount / 4, dec: 0 })
          ),
          emi: parseFloat(
            faker.finance.amount({ min: 5000, max: 40000, dec: 0 })
          ),
          interestRate: parseFloat(
            faker.finance.amount({ min: 8.5, max: 14.5, dec: 1 })
          ),
          startDate: faker.date.past({ years: 2 }),
          endDate: faker.date.future({ years: 5 }),
        });
        await loan.save();
      }

      // Finally, update the user with the final pool amounts
      user.unallocatedSavings = tempUnallocatedSavings;
      user.unallocatedInvestments = tempUnallocatedInvestments;
      await user.save();
    }
    console.log("Financial history generated successfully!");

    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  } catch (error) {
    console.error("Error seeding database:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
// /----- END VERSION V2 -----/
