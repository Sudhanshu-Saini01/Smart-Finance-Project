// client/src/features/dashboard/components/SummaryStrip/SummaryStrip.jsx

import React from "react";
import "./SummaryStrip.css";

/**
 * @function formatCurrency
 * @desc     A helper function to format a number into the Indian Rupee (INR) currency format.
 * Note: This function is duplicated in other components. For better code organization,
 * it would be ideal to move this to a shared utility file (e.g., `src/utils/formatters.js`)
 * and import it wherever needed to avoid repetition.
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

/**
 * @component SummaryStrip
 * @desc      A compact, single-row component that displays the most important
 * financial totals for the current month.
 * @param {object} { data } - The `currentMonth` object from the main financial summary.
 */
const SummaryStrip = ({ data }) => {
  // If the data hasn't loaded yet, render nothing to avoid errors.
  if (!data) return null;

  // Destructure the needed values from the data prop for easier access.
  const {
    totalIncome,
    totalSavings,
    totalInvestments,
    totalFixedExpense, // This value is received from the summary.
    totalExpense,
  } = data;

  // Calculate the user's net balance for the month.
  const balance = totalIncome - totalExpense - totalSavings - totalInvestments;

  return (
    <div className="summary-strip">
      <div className="strip-item">
        <span className="label">Income</span>
        <span className="value income">{formatCurrency(totalIncome)}</span>
      </div>
      <div className="strip-item">
        <span className="label">Savings</span>
        <span className="value savings">{formatCurrency(totalSavings)}</span>
      </div>
      <div className="strip-item">
        <span className="label">Investments</span>
        <span className="value investments">
          {formatCurrency(totalInvestments)}
        </span>
      </div>
      <div className="strip-item">
        <span className="label">Fixed Expenses</span>
        {/*
          // Note: This is an extra/non-functional feature at the moment.
          // The backend API (`/api/transactions/monthly-summary`) that provides this data
          // currently sends `totalFixedExpense` as 0. The logic to calculate
          // fixed expenses from transactions has not been implemented on the server.
          // While this code works, it will always display "₹0.00" until the backend is updated.
        */}
        <span className="value expense">
          {formatCurrency(totalFixedExpense)}
        </span>
      </div>
      <div className="strip-item">
        <span className="label">Net Balance</span>
        {/* The color of the balance (green or red) is determined by whether it's positive or negative. */}
        <span className={`value ${balance >= 0 ? "income" : "expense"}`}>
          {formatCurrency(balance)}
        </span>
      </div>
    </div>
  );
};

export default SummaryStrip;
