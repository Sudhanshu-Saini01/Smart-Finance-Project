// client/src/features/expenses/VariableExpensesPage.jsx
import React, { useState, useContext } from "react";
import { DataContext } from "@/context/DataContext";
import Modal from "@/components/ui/Modal/Modal";
import SpendingChart from "./components/SpendingChart/SpendingChart";
import RecentTransactions from "./components/RecentTransactions/RecentTransactions";
// We can reuse the same form we built for the Transactions page
import TransactionForm from "@/features/transactions/components/TransactionForm/TransactionForm";
import "./VariableExpensesPage.css";

const VariableExpensesPage = () => {
  const { transactions, loading } = useContext(DataContext);
  const [isFormModalOpen, setFormModalOpen] = useState(false);

  if (loading) {
    return <div className="loading-fullscreen">Loading Expenses...</div>;
  }

  return (
    <>
      <Modal isOpen={isFormModalOpen} onClose={() => setFormModalOpen(false)}>
        {/* Reusing our powerful, existing form component! */}
        <TransactionForm />
      </Modal>

      <div className="expenses-page-container">
        <header className="page-header">
          <div>
            <h1>Variable Expenses</h1>
            <p>Track and analyze your day-to-day spending.</p>
          </div>
          <button
            className="add-expense-btn"
            onClick={() => setFormModalOpen(true)}
          >
            + Add Expense
          </button>
        </header>

        <section className="page-section">
          <SpendingChart transactions={transactions} />
        </section>

        <section className="page-section">
          <RecentTransactions transactions={transactions} />
        </section>
      </div>
    </>
  );
};

export default VariableExpensesPage;
