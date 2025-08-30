// // client/src/features/dashboard/components/ExpensesBlueprint.jsx

// import React from "react";
// import "./ExpensesBlueprint.css";

// /**
//  * @function formatCurrency
//  * @desc     A helper function to format a number into the Indian Rupee (INR) currency format.
//  * Note: This is a duplicate function. It should ideally be moved to a shared utility file
//  * to avoid repeating code across different components.
//  */
// const formatCurrency = (amount) => {
//   return new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//   }).format(amount);
// };

// /**
//  * @component ExpensesBlueprint
//  * @desc      Provides a breakdown of the user's monthly budget, separating
//  * fixed costs from variable spending to guide their financial decisions.
//  * @param {array} { commitments } - The user's list of recurring commitments (bills, SIPs, etc.).
//  * @param {object} { summary } - The user's monthly financial summary.
//  */
// const ExpensesBlueprint = ({ commitments, summary }) => {
//   // If the necessary data isn't available yet, render nothing to avoid errors.
//   if (!commitments || !summary || !summary.currentMonth) {
//     return null;
//   }

//   // --- Calculations ---
//   // 1. Calculate total fixed expenses by summing the amounts of all recurring commitments.
//   // This represents all the money that is already allocated for the month.
//   // const fixedCosts = commitments.reduce((acc, com) => acc + com.amount, 0);

//   // --- Calculations ---
//   // THE FIX IS HERE: We now filter the commitments to only include actual costs.
//   // This prevents recurring income from being subtracted from the total income.
//   const fixedCosts = commitments
//     .filter(
//       (c) =>
//         c.commitmentType === "expense" ||
//         c.commitmentType === "savings" ||
//         c.commitmentType === "investment"
//     )
//     .reduce((acc, com) => acc + com.amount, 0);

//   // 2. Get the total of variable expenses (e.g., food, shopping) that have already been recorded this month.
//   const variableSpending = summary.currentMonth.totalExpense;

//   // 3. Calculate the amount of money the user has left for variable spending for the rest of the month.
//   // This is the key insight: it takes the total income, subtracts the mandatory fixed costs,
//   // and then subtracts what has already been spent on variable items.
//   const availableToSpend =
//     summary.currentMonth.totalIncome - fixedCosts - variableSpending;

//   return (
//     <div className="blueprint-container">
//       <div className="blueprint-item">
//         <span className="label">Total Income </span>
//         <strong className="value income">
//           {formatCurrency(summary.currentMonth.totalIncome)}
//         </strong>
//       </div>
//       <div className="blueprint-item">
//         <span className="label">Fixed Expenses (Bills, EMIs, SIPs)</span>
//         <strong className="value expense">{formatCurrency(fixedCosts)}</strong>
//       </div>
//       <div className="blueprint-item">
//         <span className="label">Variable Expenses</span>
//         <strong className="value expense">
//           {formatCurrency(variableSpending)}
//         </strong>
//       </div>
//       <div className="blueprint-item highlight">
//         <span className="label">Available for Variable Spending</span>
//         <strong className="value">{formatCurrency(availableToSpend)}</strong>
//       </div>
//     </div>
//   );
// };

// export default ExpensesBlueprint;

// client/src/features/dashboard/components/ExpensesBlueprint.jsx

import React from "react";
import "./ExpensesBlueprint.css";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

const ExpensesBlueprint = ({ commitments, summary }) => {
  // --- THIS IS THE FIX ---
  // We now also check if summary.currentMonth exists before trying to use its data.
  // This prevents the component from crashing if the summary object is present but empty.
  if (!commitments || !summary || !summary.currentMonth) {
    return null; // Render nothing if data is incomplete
  }
  // --- END OF FIX ---

  const fixedCosts = commitments
    .filter(
      (c) =>
        c.commitmentType === "expense" ||
        c.commitmentType === "savings" ||
        c.commitmentType === "investment"
    )
    .reduce((acc, com) => acc + com.amount, 0);

  const variableSpending = summary.currentMonth.totalExpense;

  const availableToSpend =
    summary.currentMonth.totalIncome - fixedCosts - variableSpending;

  return (
    <div className="blueprint-container">
      <div className="blueprint-item">
        <span className="label">Total Income </span>
        <strong className="value income">
          {formatCurrency(summary.currentMonth.totalIncome)}
        </strong>
      </div>
      <div className="blueprint-item">
        <span className="label">Fixed Expenses (Bills, EMIs, SIPs)</span>
        <strong className="value expense">{formatCurrency(fixedCosts)}</strong>
      </div>
      <div className="blueprint-item">
        <span className="label">Variable Expenses</span>
        <strong className="value expense">
          {formatCurrency(variableSpending)}
        </strong>
      </div>
      <div className="blueprint-item highlight">
        <span className="label">Available for Variable Spending</span>
        <strong className="value">{formatCurrency(availableToSpend)}</strong>
      </div>
    </div>
  );
};

export default ExpensesBlueprint;
