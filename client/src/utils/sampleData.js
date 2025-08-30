// client/src/utils/sampleData.js

// This file contains a complete set of sample data for a new user.
export const sampleData = {
  transactions: [
    {
      _id: "t1",
      date: new Date(),
      description: "Your First Coffee",
      category: "Food",
      type: "expense",
      amount: 150,
    },
    {
      _id: "t2",
      date: new Date(),
      description: "Welcome Salary",
      category: "Salary",
      type: "income",
      amount: 50000,
    },
  ],
  goals: [
    {
      _id: "g1",
      goalName: "Save for a Vacation",
      targetAmount: 75000,
      currentAmount: 15000,
      imageUrl: "https://placehold.co/400x200/6a82fb/ffffff?text=Vacation",
    },
  ],
  loans: [
    {
      _id: "l1",
      loanName: "Sample Education Loan",
      lender: "Example Bank",
      totalAmount: 500000,
      amountPaid: 75000,
      emi: 12000,
      interestRate: 8.5,
      endDate: "2028-12-01",
    },
  ],
  investments: [
    {
      _id: "i1",
      investmentName: "Sample Mutual Fund",
      investmentType: "Mutual Fund",
      amount: 25000,
    },
  ],
  commitments: [
    {
      _id: "c1",
      commitmentName: "Monthly Rent",
      commitmentType: "expense",
      amount: 20000,
      nextDueDate: "2025-09-05",
    },
    {
      _id: "c2",
      commitmentName: "Phone Bill",
      commitmentType: "expense",
      amount: 799,
      nextDueDate: "2025-09-15",
    },
  ],
  incomeSources: [
    {
      _id: "is1",
      sourceName: "Your Salary",
      incomeType: "Salary",
      grossAmount: 60000,
      netAmount: 50000,
    },
  ],
  summary: {
    currentMonth: {
      totalIncome: 50000,
      totalExpense: 150,
      totalSavings: 0,
      totalInvestments: 0,
    },
    previousMonth: {
      totalIncome: 0,
      totalExpense: 0,
      totalSavings: 0,
      totalInvestments: 0,
    },
  },
};
