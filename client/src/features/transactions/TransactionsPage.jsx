// client/src/pages/TransactionsPage.jsx

// --- Core Imports ---
import React, { useState, useContext, useMemo } from "react";
import { DataContext } from "@/context/DataContext";

// --- Component Imports ---
import TransactionForm from "@/features/transactions/components/TransactionForm/TransactionForm";
// ===================================================================
// == UPDATE: 2025-08-24 | Correct Component Path ==
// This is the fix. The path now correctly points to the new UpcomingPayments
// component inside the 'transactions' feature folder.
import UpcomingPayments from "@/features/transactions/components/UpcomingPayments/UpcomingPayments";
// ===================================================================
import ExpensesBlueprint from "@/features/dashboard/components/ExpensesBlueprint/ExpensesBlueprint";
import "./TransactionsPage.css";

// Note: The unused 'Dashboard' import has been removed for cleanup.
// import Dashboard from "./../../components/Dashboard";

const TransactionsPage = () => {
  // --- State & Context ---
  const { transactions, commitments, summary, loading, error } =
    useContext(DataContext);

  // State for the date simulator, defaulting to today.
  const [simulatedDate, setSimulatedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  // State to manage how many months of transactions are visible.
  const [visibleMonthsCount, setVisibleMonthsCount] = useState(3);

  // --- Data Processing ---
  const groupedTransactions = useMemo(() => {
    return transactions.reduce((acc, tx) => {
      const month = new Date(tx.date).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      if (!acc[month]) acc[month] = [];
      acc[month].push(tx);
      return acc;
    }, {});
  }, [transactions]);

  const months = Object.entries(groupedTransactions);

  // --- Conditional Rendering ---
  if (loading) {
    return <div className="loading-fullscreen">Loading Transactions...</div>;
  }

  // --- JSX Render ---
  return (
    <div className="transactions-page-container">
      <h1>Transactions Command Center</h1>

      <div className="transaction-section">
        <h3>Your Monthly Blueprint</h3>
        <ExpensesBlueprint commitments={commitments} summary={summary} />
      </div>

      <div className="grid">
        <div className="transaction-section">
          <TransactionForm />
        </div>
      </div>
      <div className="grid">
        <div className="transaction-section">
          <h3>Upcoming Payments</h3>
          <UpcomingPayments simulatedDate={simulatedDate} />
        </div>
      </div>

      <div className="transaction-section date-simulator">
        <h3>Test & Simulate</h3>
        <div className="form-group">
          <label htmlFor="simulatedDate">Simulate Today's Date</label>
          <input
            type="date"
            id="simulatedDate"
            value={simulatedDate}
            onChange={(e) => setSimulatedDate(e.target.value)}
          />
        </div>
      </div>

      <div className="transaction-section">
        <h3>Transaction History</h3>
        {error && <p className="error-message">{error}</p>}
        <div className="table-container">
          {months.slice(0, visibleMonthsCount).map(([month, txs]) => (
            <div key={month} className="month-group">
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
                        <span className={`type-pill ${t.type}`}>{t.type}</span>
                      </td>
                      <td className={`amount ${t.type}`}>
                        {t.type === "expense" ? "-" : "+"}
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                        }).format(t.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
        {months.length > visibleMonthsCount && (
          <button
            onClick={() => setVisibleMonthsCount((prev) => prev + 3)}
            className="load-more-btn"
          >
            Load More...
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
