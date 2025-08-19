// client/src/components/MonthlyStatusCard.jsx (NEW FILE)

import React from "react";
import "./MonthlyStatusCard.css";

// A helper function to format dates nicely
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const MonthlyStatusCard = ({ data }) => {
  if (!data) return null;

  const {
    month,
    year,
    totalIncome,
    totalExpense,
    totalSavings,
    totalInvestments,
    lastIncomeDate,
    lastExpenseDate,
  } = data;

  const balance =
    totalIncome - (totalExpense + totalSavings + totalInvestments);
  let statusColor = "yellow";
  if (balance > 0) statusColor = "green";
  if (balance < 0) statusColor = "red";

  return (
    <div className={`status-card ${statusColor}`}>
      <div className="card-header">
        <h3>{month} Status</h3>
        <span className="card-year">{year}</span>
      </div>
      <div className="card-body">
        <div className="card-metric income">
          <span className="metric-label">Income</span>
          <span className="metric-value">${totalIncome.toFixed(2)}</span>
          <span className="metric-date">
            Last: {formatDate(lastIncomeDate)}
          </span>
        </div>
        <div className="card-metric expense">
          <span className="metric-label">Expenses</span>
          <span className="metric-value">${totalExpense.toFixed(2)}</span>
          <span className="metric-date">
            Last: {formatDate(lastExpenseDate)}
          </span>
        </div>
        <div className="card-metric savings">
          <span className="metric-label">Savings</span>
          <span className="metric-value">${totalSavings.toFixed(2)}</span>
        </div>
        <div className="card-metric investments">
          <span className="metric-label">Investments</span>
          <span className="metric-value">${totalInvestments.toFixed(2)}</span>
        </div>
      </div>
      <div className="card-footer">
        <span>Net Balance</span>
        <span>${balance.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default MonthlyStatusCard;
