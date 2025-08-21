// client/src/components/MonthlyStatusCard.jsx

import React from "react";
import "./MonthlyStatusCard.css";

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// NEW: Helper function to format currency for India
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

const MonthlyStatusCard = ({ data, user, className }) => {
  if (!data) return null;

  const {
    month,
    year,
    totalIncome,
    totalExpense,
    // totalSavings,
    // totalInvestments,
    lastIncomeDate,
    lastExpenseDate,
  } = data;

  const totalSavings = user?.unallocatedSavings || 0;
  const totalInvestments = user?.unallocatedInvestments || 0;

  const balance =
    totalIncome - (totalExpense + totalSavings + totalInvestments);
  let statusColor = "yellow";
  if (balance > 5000) statusColor = "green"; // Adjusted threshold for INR
  if (balance < 0) statusColor = "red";

  return (
    <div className={`status-card ${statusColor} ${className || ""}`}>
      <div className="card-header">
        <h3>{month} Status</h3>
        <span className="card-year">{year}</span>
      </div>
      <div className="card-body">
        <div className="card-metric income">
          <span className="metric-label">Income</span>
          <span className="metric-value">{formatCurrency(totalIncome)}</span>
          <span className="metric-date">
            Last: {formatDate(lastIncomeDate)}
          </span>
        </div>
        <div className="card-metric expense">
          <span className="metric-label">Expenses</span>
          <span className="metric-value">{formatCurrency(totalExpense)}</span>
          <span className="metric-date">
            Last: {formatDate(lastExpenseDate)}
          </span>
        </div>
        <div className="card-metric savings">
          <span className="metric-label">Savings</span>
          <span className="metric-value">{formatCurrency(totalSavings)}</span>
        </div>
        <div className="card-metric investments">
          <span className="metric-label">Investments</span>
          <span className="metric-value">
            {formatCurrency(totalInvestments)}
          </span>
        </div>
      </div>
      <div className="card-footer">
        <span>Net Balance</span>
        {/* The value is now inside its own span for better alignment */}
        <span className="balance-value">{formatCurrency(balance)}</span>
      </div>
    </div>
  );
};

export default MonthlyStatusCard;
