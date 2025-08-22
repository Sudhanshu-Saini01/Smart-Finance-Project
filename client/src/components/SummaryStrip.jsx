// client/src/components/SummaryStrip.jsx
//-------- Start: Version V3.0.0---------//

import React from "react";
import "./SummaryStrip.css";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

const SummaryStrip = ({ data }) => {
  if (!data) return null;

  const {
    totalIncome,
    totalSavings,
    totalInvestments,
    totalFixedExpense,
    totalExpense,
  } = data;
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
        <span className="value expense">
          {formatCurrency(totalFixedExpense)}
        </span>
      </div>
      <div className="strip-item">
        <span className="label">Net Balance</span>
        <span className={`value ${balance >= 0 ? "income" : "expense"}`}>
          {formatCurrency(balance)}
        </span>
      </div>
    </div>
  );
};

export default SummaryStrip;
