// client/src/components/LoanCard.jsx
// /----- VERSION V2 -----/

import React from "react";
import "./LoanCard.css"; // We will create this next

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

const LoanCard = ({ loan }) => {
  const {
    loanName,
    lender,
    loanType,
    assetType,
    totalAmount,
    amountPaid,
    emi,
    interestRate,
    endDate,
  } = loan;

  const remainingAmount = totalAmount - amountPaid;
  const progress = (amountPaid / totalAmount) * 100;

  // Advisor logic for color-coding
  let cardColorClass = "neutral";
  if (assetType === "appreciating") cardColorClass = "appreciating";
  if (assetType === "depreciating") cardColorClass = "depreciating";

  return (
    <div className={`loan-card ${cardColorClass}`}>
      <div className="loan-card-header">
        <h3>{loanName}</h3>
        <span className="loan-type-pill">{loanType}</span>
      </div>
      <div className="loan-card-body">
        <div className="lender-info">
          <strong>Lender:</strong> {lender}
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="progress-text">
          <span>Paid: {formatCurrency(amountPaid)}</span>
          <span>Remaining: {formatCurrency(remainingAmount)}</span>
        </div>
        <div className="loan-details-grid">
          <div>
            <span>Total Amount</span>
            <strong>{formatCurrency(totalAmount)}</strong>
          </div>
          <div>
            <span>Monthly EMI</span>
            <strong>{formatCurrency(emi)}</strong>
          </div>
          <div>
            <span>Interest Rate</span>
            <strong>{interestRate}% p.a.</strong>
          </div>
          <div>
            <span>End Date</span>
            <strong>{new Date(endDate).toLocaleDateString()}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanCard;
// /----- END VERSION V2 -----/
