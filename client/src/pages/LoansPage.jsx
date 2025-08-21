// client/src/pages/LoansPage.jsx

import React, { useContext } from "react";
import { DataContext } from "../context/DataContext";
import LoanCard from "../components/LoanCard";
import "./LoansPage.css";

const LoansPage = () => {
  const { loans, loading, error } = useContext(DataContext);

  if (loading) {
    return <div className="loading-fullscreen">Loading Loans...</div>;
  }

  return (
    <div className="loans-page-container">
      <h1>Loan Management</h1>

      <div className="loans-section">
        <h3>Add a New Loan</h3>
        <div className="new-loan-placeholder">
          <p>The form to add new loans will be built here soon.</p>
          <button disabled>Add Loan</button>
        </div>
      </div>

      <div className="loans-section">
        <h3>Your Active Loans</h3>
        {error && <p className="error-message">{error}</p>}
        <div className="loans-grid">
          {loans.length > 0 ? (
            loans.map((loan) => <LoanCard key={loan._id} loan={loan} />)
          ) : (
            <p>You have no active loans. Congratulations on being debt-free!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoansPage;
