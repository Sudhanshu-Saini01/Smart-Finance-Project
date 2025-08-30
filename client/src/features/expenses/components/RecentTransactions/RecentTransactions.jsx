// client/src/features/expenses/components/RecentTransactions/RecentTransactions.jsx
import React from "react";
import "./RecentTransactions.css";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    amount
  );

const RecentTransactions = ({ transactions }) => {
  const variableExpenses = transactions
    .filter((tx) => tx.type === "expense")
    .slice(0, 10); // Show the 10 most recent

  return (
    <div className="list-container">
      <h3>Recent Variable Expenses</h3>
      <ul>
        {variableExpenses.map((tx) => (
          <li key={tx._id} className="transaction-item">
            <div className="item-details">
              <strong>{tx.description}</strong>
              <span>{tx.category}</span>
            </div>
            <div className="item-amount">
              <strong>{formatCurrency(tx.amount)}</strong>
              <span>{new Date(tx.date).toLocaleDateString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default RecentTransactions;
