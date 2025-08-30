// client/src/features/income/components/IncomeCard/IncomeCard.jsx
import React from "react";
import "./IncomeCard.css";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    amount
  );

const IncomeCard = ({ source }) => {
  const deductions = source.grossAmount - source.netAmount;

  return (
    <div className="income-card">
      <div className="card-header">
        <h3>{source.sourceName}</h3>
        <span className="income-type-pill">{source.incomeType}</span>
      </div>
      <div className="card-body">
        <div className="income-row">
          <span>Gross Amount</span>
          <strong className="amount gross">
            {formatCurrency(source.grossAmount)}
          </strong>
        </div>
        <div className="income-row">
          <span>Taxes & Deductions</span>
          <strong className="amount deductions">
            - {formatCurrency(deductions)}
          </strong>
        </div>
      </div>
      <div className="card-footer">
        <span>Net In-Hand Amount</span>
        <strong className="amount net">
          {formatCurrency(source.netAmount)}
        </strong>
      </div>
    </div>
  );
};

export default IncomeCard;
