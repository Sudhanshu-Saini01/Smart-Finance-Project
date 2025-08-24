// client/src/components/TransactionList.jsx (NEW FILE)

import React from "react";

const TransactionList = ({ transactions }) => {
  if (transactions.length === 0) {
    return <p>No transactions yet. Add one above!</p>;
  }

  return (
    <ul className="transaction-list">
      {transactions.map((t) => (
        <li key={t._id} className={`transaction-item ${t.type}`}>
          <span className="description">{t.description}</span>
          <span className={`amount ${t.type}`}>
            {t.type === "expense" ? "-" : "+"}${t.amount.toFixed(2)}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default TransactionList;
