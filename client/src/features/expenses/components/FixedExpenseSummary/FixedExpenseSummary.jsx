// client/src/features/expenses/components/FixedExpenseSummary/FixedExpenseSummary.jsx
import React, { useMemo } from "react";
import "./FixedExpenseSummary.css";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    amount
  );

const FixedExpenseSummary = ({ recurrings }) => {
  const { totalMonthlyCost, upcomingBill } = useMemo(() => {
    const fixedExpenses = recurrings.filter(
      (c) => c.recurringType === "expense"
    );
    const totalMonthlyCost = fixedExpenses.reduce(
      (acc, c) => acc + c.amount,
      0
    );

    const upcomingBill = fixedExpenses
      .filter((c) => new Date(c.nextDueDate) >= new Date())
      .sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate))[0];

    return { totalMonthlyCost, upcomingBill };
  }, [recurrings]);

  return (
    <div className="summary-grid">
      <div className="stat-card">
        <span className="stat-label">Total Monthly Fixed Costs</span>
        <strong className="stat-value">
          {formatCurrency(totalMonthlyCost)}
        </strong>
      </div>
      <div className="stat-card">
        <span className="stat-label">Next Upcoming Bill</span>
        {upcomingBill ? (
          <>
            <strong className="stat-value">{upcomingBill.recurringName}</strong>
            <span className="stat-subvalue">
              {new Date(upcomingBill.nextDueDate).toLocaleDateString()}
            </span>
          </>
        ) : (
          <strong className="stat-value">None</strong>
        )}
      </div>
    </div>
  );
};

export default FixedExpenseSummary;
