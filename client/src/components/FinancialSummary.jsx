// client/src/components/FinancialSummary.jsx (NEW FILE)

import React, { useState, useEffect } from "react";
// import axios from "axios";
import "../FinancialSummary.css";

// const FinancialSummary = () => {
//   const [summary, setSummary] = useState({
//     totalIncome: 0,
//     totalExpense: 0,
//     balance: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [status, setStatus] = useState({
//     color: "grey",
//     message: "Calculating...",
//   });

//   useEffect(() => {
//     const fetchSummary = async () => {
//       try {
//         const res = await axios.get(
//           "http://localhost:3001/api/transactions/summary"
//         );
//         setSummary(res.data);
//         determineStatus(res.data.balance);
//       } catch (err) {
//         console.error("Failed to fetch summary", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSummary();
//   }, [summary]); // Re-run when summary changes (e.g., new transaction)

//   const determineStatus = (balance) => {
//     if (balance > 0) {
//       setStatus({ color: "green", message: "You are in surplus!" });
//     } else if (balance === 0) {
//       setStatus({ color: "yellow", message: "You are breaking even." });
//     } else {
//       setStatus({ color: "red", message: "You are in a deficit." });
//     }
//   };

//   if (loading) {
//     return <div className="summary-card loading">Loading summary...</div>;
//   }

const FinancialSummary = ({ summary }) => {
  // Receive summary as a prop
  const [status, setStatus] = useState({
    color: "grey",
    message: "Calculating...",
  });

  useEffect(() => {
    if (summary) {
      determineStatus(summary.balance);
    }
  }, [summary]); // Re-run when the summary prop changes

  const determineStatus = (balance) => {
    if (balance > 0) {
      setStatus({ color: "green", message: "You are in surplus!" });
    } else if (balance === 0) {
      setStatus({ color: "yellow", message: "You are breaking even." });
    } else {
      setStatus({ color: "red", message: "You are in a deficit." });
    }
  };

  return (
    <div className={`summary-card ${status.color}`}>
      <h3>Financial Health</h3>
      <p className="status-message">{status.message}</p>
      <div className="summary-details">
        <div className="detail-item">
          <span>Total Income</span>
          <strong className="income">${summary.totalIncome.toFixed(2)}</strong>
        </div>
        <div className="detail-item">
          <span>Total Expenses</span>
          <strong className="expense">
            ${summary.totalExpense.toFixed(2)}
          </strong>
        </div>
        <div className="detail-item balance">
          <span>Current Balance</span>
          <strong>${summary.balance.toFixed(2)}</strong>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
