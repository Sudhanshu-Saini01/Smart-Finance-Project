// client/src/features/savings/SavingsPage.jsx
import React, { useState, useContext } from "react";
import { DataContext } from "@/context/DataContext";
import Modal from "@/components/ui/Modal/Modal";
import SavingsGoalCard from "./components/SavingsGoalCard/SavingsGoalCard";
import SavingsForm from "./components/SavingsForm/SavingsForm";
import "./SavingsPage.css";

const SavingsPage = () => {
  const { goals, loading } = useContext(DataContext);
  const [isFormModalOpen, setFormModalOpen] = useState(false);

  if (loading) {
    return <div className="loading-fullscreen">Loading Savings Goals...</div>;
  }

  // Example calculation for the overview
  const totalSaved = goals.reduce(
    (acc, goal) => acc + (goal.currentAmount || goal.targetAmount * 0.45),
    0
  );

  return (
    <>
      <Modal isOpen={isFormModalOpen} onClose={() => setFormModalOpen(false)}>
        <SavingsForm onClose={() => setFormModalOpen(false)} />
      </Modal>

      <div className="savings-page-container">
        <header className="page-header">
          <div>
            <h1>Savings Hub</h1>
            <p>Set, track, and achieve your financial goals.</p>
          </div>
          <button
            className="add-goal-btn"
            onClick={() => setFormModalOpen(true)}
          >
            + New Goal
          </button>
        </header>

        <section className="savings-overview">
          <div className="stat-card">
            <span className="stat-label">Total Saved Across All Goals</span>
            <strong className="stat-value">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(totalSaved)}
            </strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Active Goals</span>
            <strong className="stat-value">{goals.length}</strong>
          </div>
        </section>

        <section className="goals-grid">
          {goals.length > 0 ? (
            goals.map((goal) => <SavingsGoalCard key={goal._id} goal={goal} />)
          ) : (
            <p>
              You haven't set any savings goals yet. Add one to get started!
            </p>
          )}
        </section>
      </div>
    </>
  );
};

export default SavingsPage;
