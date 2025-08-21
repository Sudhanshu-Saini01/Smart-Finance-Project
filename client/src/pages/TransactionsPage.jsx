// client/src/pages/TransactionsPage.jsx (FIXED)

import React, { useState, useContext } from "react";
import { DataContext } from "../context/DataContext";
import TransactionForm from "../components/TransactionForm";
import AllocationModal from "../components/AllocationModal";
import "./TransactionsPage.css";

const TransactionsPage = () => {
  // 1. GET 'goals' FROM THE CONTEXT, NOT 'wishlist'
  const { transactions, loading, error, refetchData, goals } =
    useContext(DataContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIncomeTx, setCurrentIncomeTx] = useState(null);

  const handleIncomeAdded = (incomeTx) => {
    setCurrentIncomeTx(incomeTx);
    setIsModalOpen(true);
  };

  // const now = new Date();
  // const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  // const currentMonthTxs = transactions.filter(
  //   (t) => new Date(t.date) >= startOfCurrentMonth
  // );
  // const previousMonthTxs = transactions.filter(
  //   (t) => new Date(t.date) < startOfCurrentMonth
  // );

  const groupedTransactions = transactions.reduce((acc, tx) => {
    const month = new Date(tx.date).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(tx);
    return acc;
  }, {});

  if (loading) {
    return <div className="loading-fullscreen">Loading Transactions...</div>;
  }

  return (
    <>
      <AllocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        incomeTransaction={currentIncomeTx}
        onApply={refetchData}
      />

      <div className="transactions-page-container">
        <h1>Manage Transactions</h1>
        <div className="transaction-section">
          <TransactionForm
            onTransactionAdded={refetchData}
            onIncomeAdded={handleIncomeAdded}
            wishlistItems={goals}
          />
        </div>
        <div className="transaction-section">
          <h3>Transaction History</h3>
          {error && <p className="error-message">{error}</p>}
          <div className="table-container">
            {Object.entries(groupedTransactions).map(([month, txs]) => (
              <div key={month}>
                <h4 className="month-separator">{month}</h4>
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
                    {txs.map((t) => (
                      <tr key={t._id}>
                        <td>{new Date(t.date).toLocaleDateString()}</td>
                        <td>{t.description}</td>
                        <td>{t.category}</td>
                        <td>
                          <span className={`type-pill ${t.type}`}>
                            {t.type}
                          </span>
                        </td>
                        <td className={`amount ${t.type}`}>{/*...*/}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionsPage;
