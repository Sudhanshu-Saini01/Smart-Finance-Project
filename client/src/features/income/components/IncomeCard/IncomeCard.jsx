// client/src/features/income/components/IncomeCard/IncomeCard.jsx
import React from "react";
import { Pencil, Trash2 } from "lucide-react"; // Import icons
import "./IncomeCard.css";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    amount
  );

// The component now accepts onEdit and onDelete functions
const IncomeCard = ({ source, onEdit, onDelete }) => {
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
        <div>
          <span>Net In-Hand Amount</span>
          <strong className="amount net">
            {formatCurrency(source.netAmount)}
          </strong>
        </div>
        {/* --- NEW: Action Buttons --- */}
        <div className="card-actions">
          <button
            onClick={() => onEdit(source)}
            className="action-btn edit-btn"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(source._id)}
            className="action-btn delete-btn"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomeCard;
