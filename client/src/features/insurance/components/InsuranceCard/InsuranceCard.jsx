// client/src/features/insurance/components/InsuranceCard/InsuranceCard.jsx
import React from "react";
import "./InsuranceCard.css";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const InsuranceCard = ({ policy }) => {
  return (
    <div className="policy-card">
      <div className="policy-card-header">
        <h4>{policy.policyName}</h4>
        <span className="policy-type-pill">{policy.policyType}</span>
      </div>
      <div className="policy-card-body">
        <div className="policy-detail">
          <span className="detail-label">Provider</span>
          <strong className="detail-value">{policy.provider}</strong>
        </div>
        <div className="policy-detail">
          <span className="detail-label">Policy Number</span>
          <strong className="detail-value">{policy.policyNumber}</strong>
        </div>
        <div className="policy-detail">
          <span className="detail-label">Coverage Amount</span>
          <strong className="detail-value coverage">
            {formatCurrency(policy.coverageAmount)}
          </strong>
        </div>
      </div>
      <div className="policy-card-footer">
        <span className="detail-label">Next Premium Due</span>
        <strong className="detail-value">
          {new Date(policy.nextDueDate).toLocaleDateString()}
        </strong>
        <strong className="premium-amount">
          {formatCurrency(policy.premiumAmount)}
        </strong>
      </div>
    </div>
  );
};

export default InsuranceCard;
