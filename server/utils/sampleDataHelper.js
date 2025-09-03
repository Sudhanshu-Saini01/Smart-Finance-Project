// server/utils/sampleDataHelper.js
import Transaction from "../models/Transaction.js";
import Goal from "../models/Goal.js";
import Loan from "../models/Loan.js";
import Commitment from "../models/Recurring.js";
import IncomeSource from "../models/IncomeSource.js";
import Insurance from "../models/Insurance.js";
import Investment from "../models/Investment.js";

export const createSampleDataForUser = async (userId) => {
  try {
    const today = new Date();

    // 1. Income Sources
    const incomeSource = await IncomeSource.create({
      user: userId,
      sourceName: "Tech Corp Salary",
      incomeType: "Salary",
      grossAmount: 75000,
      netAmount: 62000,
      frequency: "monthly",
    });

    // 2. Commitments (Recurring Expenses)
    await Commitment.create([
      {
        user: userId,
        name: "Monthly Rent",
        type: "expense",
        amount: 20000,
        frequency: "monthly",
        nextDueDate: new Date(today.getFullYear(), today.getMonth() + 1, 1),
      },
      {
        user: userId,
        name: "Mutual Fund SIP",
        type: "investment",
        amount: 10000,
        frequency: "monthly",
        nextDueDate: new Date(today.getFullYear(), today.getMonth() + 1, 5),
      },
    ]);

    // 3. Transactions
    await Transaction.create([
      {
        user: userId,
        description: "Monthly Salary",
        category: "Salary",
        type: "income",
        amount: incomeSource.netAmount,
      },
      {
        user: userId,
        description: "Rent Payment",
        category: "Housing",
        type: "expense",
        amount: 20000,
      },
      {
        user: userId,
        description: "Mutual Fund SIP",
        category: "Investment",
        type: "investment",
        amount: 10000,
      },
      {
        user: userId,
        description: "Groceries",
        category: "Food",
        type: "expense",
        amount: 2500,
      },
    ]);

    // 4. Savings Goal
    await Goal.create({
      user: userId,
      goalName: "Buy New Laptop",
      targetAmount: 120000,
      currentAmount: 35000,
    });

    // 5. Loan
    await Loan.create({
      user: userId,
      loanName: "Car Loan",
      lender: "State Bank",
      totalAmount: 400000,
      emi: 15000,
      interestRate: 9.5,
      amountPaid: 45000,
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(today.getFullYear() + 3)),
    });

    // 6. Insurance
    await Insurance.create({
      user: userId,
      policyName: "Family Health Insurance",
      policyType: "Health",
      provider: "Care Health",
      coverageAmount: 1000000,
      premiumAmount: 18000,
      nextDueDate: new Date(today.setFullYear(today.getFullYear() + 1)),
    });

    // 7. Investment
    await Investment.create({
      user: userId,
      investmentName: "Nifty 50 Index Fund",
      investmentType: "Mutual Fund",
      amount: 50000,
    });

    console.log(`✅ COMPLETE sample data suite created for user ${userId}`);
  } catch (error) {
    console.error(
      `❌ Error creating full sample data suite for user ${userId}:`,
      error
    );
  }
};
