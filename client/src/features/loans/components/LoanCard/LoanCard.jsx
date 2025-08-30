// client/src/features/loans/components/LoanCard/LoanCard.jsx

import React from "react";
import "./LoanCard.css";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const LoanCard = ({ loan }) => {
  const amountPaid = loan.amountPaid || 0;
  const progressPercent = (amountPaid / loan.totalAmount) * 100;
  const remainingAmount = loan.totalAmount - amountPaid;

  return (
    <div className="loan-card">
      <div className="loan-card-header">
        <h4>{loan.loanName}</h4>
        <span className="lender-tag">{loan.lender}</span>
      </div>
      <div className="loan-card-body">
        <div className="loan-stat">
          <span className="stat-label">Amount Remaining</span>
          <strong className="stat-value">
            {formatCurrency(remainingAmount)}
          </strong>
        </div>
        <div className="loan-stat">
          <span className="stat-label">Monthly EMI</span>
          <strong className="stat-value">{formatCurrency(loan.emi)}</strong>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <div className="progress-text">
          <span>Paid: {formatCurrency(amountPaid)}</span>
          <span className="target-amount">
            Total: {formatCurrency(loan.totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoanCard;
