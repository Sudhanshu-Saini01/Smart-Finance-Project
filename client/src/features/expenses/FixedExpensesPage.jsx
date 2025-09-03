// client/src/features/expenses/FixedExpensesPage.jsx
import React, { useState, useContext } from "react";
import { DataContext } from "@/context/DataContext";
import Modal from "@/components/ui/Modal/Modal";
import FixedExpenseSummary from "./components/FixedExpenseSummary/FixedExpenseSummary";
import FixedExpenseList from "./components/FixedExpenseList/FixedExpenseList";
import FixedExpenseForm from "./components/FixedExpenseForm/FixedExpenseForm";
import "./FixedExpensesPage.css";

const FixedExpensesPage = () => {
  const { recurrings, loading } = useContext(DataContext);
  const [isFormModalOpen, setFormModalOpen] = useState(false);

  if (loading) {
    return <div className="loading-fullscreen">Loading Fixed Expenses...</div>;
  }

  return (
    <>
      <Modal isOpen={isFormModalOpen} onClose={() => setFormModalOpen(false)}>
        <FixedExpenseForm onClose={() => setFormModalOpen(false)} />
      </Modal>

      <div className="expenses-page-container">
        <header className="page-header">
          <div>
            <h1>Fixed Expenses</h1>
            <p>
              Manage your recurring bills, subscriptions, and mandatory
              payments.
            </p>
          </div>
          <button
            className="add-expense-btn"
            onClick={() => setFormModalOpen(true)}
          >
            + New Expense
          </button>
        </header>

        <section className="page-section">
          <FixedExpenseSummary recurrings={recurrings} />
        </section>

        <section className="page-section">
          <FixedExpenseList recurrings={recurrings} />
        </section>
      </div>
    </>
  );
};

export default FixedExpensesPage;
