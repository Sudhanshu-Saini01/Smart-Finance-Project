// client/src/features/loans/components/LoanSummary/LoanSummary.jsx
import React, { useMemo } from "react";
import "./LoanSummary.css"; // We'll create this in the main page CSS

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    amount
  );

const LoanSummary = ({ loans }) => {
  const { totalDebt, monthlyEmi } = useMemo(() => {
    return loans.reduce(
      (acc, loan) => {
        acc.totalDebt += loan.totalAmount - (loan.amountPaid || 0);
        acc.monthlyEmi += loan.emi;
        return acc;
      },
      { totalDebt: 0, monthlyEmi: 0 }
    );
  }, [loans]);

  return (
    <div className="loan-summary-container">
      <div className="stat-card">
        <span className="stat-label">Total Outstanding Debt</span>
        <strong className="stat-value">{formatCurrency(totalDebt)}</strong>
      </div>
      <div className="stat-card">
        <span className="stat-label">Total Monthly EMI</span>
        <strong className="stat-value">{formatCurrency(monthlyEmi)}</strong>
      </div>
    </div>
  );
};

export default LoanSummary;
