// client/src/components/MonthlyStatusCard.jsx

import React from "react";
import "./MonthlyStatusCard.css";

// /----- VERSION V2.1: Currency Fix -----/
// This helper function now correctly formats numbers as Indian Rupees (₹)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};
// /----- END VERSION V2.1 -----/

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const MonthlyStatusCard = ({ data, user, className }) => {
  if (!data || !user) {
    return null;
  }

  const {
    month,
    year,
    totalIncome,
    totalExpense,
    lastIncomeDate,
    lastExpenseDate,
  } = data;

  const totalSavings = user.unallocatedSavings || 0;
  const totalInvestments = user.unallocatedInvestments || 0;

  const balance = totalIncome - totalExpense;

  let statusColor = "yellow";
  if (balance > 5000) statusColor = "green";
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
          <span className="metric-label">Available Savings</span>
          <span className="metric-value">{formatCurrency(totalSavings)}</span>
        </div>
        <div className="card-metric investments">
          <span className="metric-label">Available for Investment</span>
          <span className="metric-value">
            {formatCurrency(totalInvestments)}
          </span>
        </div>
      </div>
      <div className="card-footer">
        <span>Net Monthly Flow</span>
        <span className="balance-value">{formatCurrency(balance)}</span>
      </div>
    </div>
  );
};

export default MonthlyStatusCard;
