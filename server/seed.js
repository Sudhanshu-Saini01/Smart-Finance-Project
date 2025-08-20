// server/seed.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");
require("dotenv").config();

// Import all of our models
const User = require("./models/User");
const Transaction = require("./models/Transaction");
const WishlistItem = require("./models/WishlistItem");
const SavingsGoal = require("./models/SavingsGoal");

const MONGODB_URI = process.env.DATABASE_URL;

const seedDatabase = async () => {
  try {
    // 1. Connect to the database
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected for seeding...");

    // 2. Clear all existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await WishlistItem.deleteMany({});
    await SavingsGoal.deleteMany({});

    // 3. Create 10 users
    console.log("Creating 10 new users...");
    const users = [];
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    for (let i = 0; i < 10; i++) {
      const user = new User({
        email: faker.internet.email(),
        password: hashedPassword,
      });
      users.push(await user.save());
    }
    console.log(`${users.length} users created.`);

    // 4. For each user, generate a year's worth of data
    console.log("Generating detailed financial history for each user...");
    for (const user of users) {
      // Generate 12 months of salary
      for (let i = 0; i < 12; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const salary = new Transaction({
          user: user._id,
          description: "Monthly Salary",
          amount: faker.finance.amount(4000, 9000, 2),
          type: "income",
          category: "Salary",
          occurrence: "monthly",
          date: date,
        });
        await salary.save();
      }

      // Generate 100 random expenses over the last year
      for (let i = 0; i < 100; i++) {
        const date = faker.date.past({ years: 1 });
        const expense = new Transaction({
          user: user._id,
          description: faker.commerce.productName(),
          amount: faker.finance.amount(5, 300, 2),
          type: "expense",
          category: faker.helpers.arrayElement([
            "Groceries",
            "Utilities",
            "Transport",
            "Entertainment",
            "Other",
          ]),
          occurrence: "one-time",
          date: date,
        });
        await expense.save();
      }

      // Generate 2-3 wishlist items
      for (let i = 0; i < faker.number.int({ min: 2, max: 3 }); i++) {
        const itemPrice = faker.finance.amount(500, 5000, 0);
        const savedAmount = faker.finance.amount(0, itemPrice / 2, 0);
        const wishlistItem = new WishlistItem({
          user: user._id,
          itemName: faker.commerce.productName(),
          itemPrice: itemPrice,
          savedAmount: savedAmount,
          category: faker.helpers.arrayElement([
            "electronics",
            "vacation",
            "vehicle",
            "other",
          ]),
        });
        const savedWishlistItem = await wishlistItem.save();

        // Create a linked savings goal for that wishlist item
        const savingsGoal = new SavingsGoal({
          user: user._id,
          goalName: `Fund for ${savedWishlistItem.itemName}`,
          targetAmount: savedWishlistItem.itemPrice,
          currentAmount: savedWishlistItem.savedAmount,
          wishlistItem: savedWishlistItem._id,
        });
        await savingsGoal.save();
      }
    }
    console.log("Financial history generated successfully!");

    // 5. Disconnect from the database
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  } catch (error) {
    console.error("Error seeding database:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
