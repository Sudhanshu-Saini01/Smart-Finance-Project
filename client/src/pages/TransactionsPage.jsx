// client/src/pages/TransactionsPage.jsx (REFURBISHED)

import React, { useContext } from "react";
import { DataContext } from "../context/DataContext"; // 1. Import the DataContext
import "./TransactionsPage.css";

const TransactionsPage = () => {
  // 2. Get the transactions list and loading state from the central hub
  const { transactions, loading, error } = useContext(DataContext);

  if (loading) {
    return <div className="loading-fullscreen">Loading Transactions...</div>;
  }

  return (
    <div className="transactions-page-container">
      <h1>Transaction History</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t._id}>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td>{t.description}</td>
                <td>{t.category}</td>
                <td>
                  <span className={`type-pill ${t.type}`}>{t.type}</span>
                </td>
                <td className={`amount ${t.type}`}>
                  {t.type === "expense" ? "-" : "+"}${t.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsPage;
