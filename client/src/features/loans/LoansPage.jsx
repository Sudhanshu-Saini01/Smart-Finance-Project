// client/src/features/loans/LoansPage.jsx

import React, { useState, useContext, useMemo } from 'react';
import { DataContext } from '@/context/DataContext';
import Modal from '@/components/ui/Modal/Modal';
import LoanForm from './components/LoanForm/LoanForm';
import LoanSummary from './components/LoanSummary/LoanSummary';
// --- NEW: Import our advanced LoanCard component ---
import LoanCard from './components/LoanCard/LoanCard'; 
import './LoansPage.css';

const LoansPage = () => {
  const { loans, loading, error } = useContext(DataContext);
  const [isFormModalOpen, setFormModalOpen] = useState(false);

  if (loading) {
    return <div className="loading-fullscreen">Loading Loans...</div>;
  }

  return (
    <>
      <Modal isOpen={isFormModalOpen} onClose={() => setFormModalOpen(false)}>
        <LoanForm onClose={() => setFormModalOpen(false)} />
      </Modal>

      <div className="loans-page-container">
        <header className="page-header">
          <div>
            <h1>Loan Management</h1>
            <p>A comprehensive overview of your debts and liabilities.</p>
          </div>
          <button className="add-loan-btn" onClick={() => setFormModalOpen(true)}>
            + Add New Loan
          </button>
        </header>

        {error && <p className="error-message">{error}</p>}
        
        <section className="page-section">
            <LoanSummary loans={loans} />
        </section>

        <section className="page-section">
            <h3>Your Active Loans</h3>
            <div className="loans-grid">
                {loans && loans.length > 0 ? (
                    loans.map((loan) => (
                        // --- Use the new LoanCard component ---
                        <LoanCard key={loan._id} loan={loan} />
                    ))
                ) : (
                    <div className="empty-state">
                        <p>You have no active loans. Congratulations!</p>
                    </div>
                )}
            </div>
        </section>
      </div>
    </>
  );
};

export default LoansPage;