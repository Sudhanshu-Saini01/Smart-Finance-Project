// client/src/components/ExpensesBlueprint.jsx
//-------- Start: Version V3.0.0---------//

import React from "react";
import "./ExpensesBlueprint.css";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

const ExpensesBlueprint = ({ commitments, summary }) => {
  if (!commitments || !summary) return null;

  // Calculate total fixed costs from all recurring commitments
  const fixedCosts = commitments.reduce((acc, com) => acc + com.amount, 0);

  // Calculate variable spending so far this month
  const variableSpending = summary.currentMonth.totalExpense;

  // The advisor's suggestion
  const availableToSpend = summary.currentMonth.totalIncome - fixedCosts;

  return (
    <div className="blueprint-container">
      <div className="blueprint-item">
        <span className="label">Total Income This Month</span>
        <strong className="value income">
          {formatCurrency(summary.currentMonth.totalIncome)}
        </strong>
      </div>
      <div className="blueprint-item">
        <span className="label">Fixed Costs (Bills, EMIs, SIPs)</span>
        <strong className="value expense">{formatCurrency(fixedCosts)}</strong>
      </div>
      <div className="blueprint-item">
        <span className="label">Variable Spending (So Far)</span>
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
//-------- End: Version V3.0.0---------//
