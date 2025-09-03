// client/src/features/income/IncomePage.jsx
import React, { useState, useContext } from "react";
import { DataContext } from "@/context/DataContext";
import { NotificationContext } from "@/context/NotificationContext";
import api from "@/utils/api";
import Modal from "@/components/ui/Modal/Modal";
import IncomeSourceForm from "./components/IncomeSourceForm/IncomeSourceForm";
import IncomeSummary from "./components/IncomeSummary/IncomeSummary";
import IncomeCard from "./components/IncomeCard/IncomeCard";
import { PlusCircle } from "lucide-react";
import "./IncomePage.css";

// New component for the actionable empty state
const EmptyState = ({ onAddClick }) => (
  <div className="actionable-empty-state">
    <div className="empty-state-icon">💰</div>
    <h3>No Income Sources Added</h3>
    <p>
      Track your salary, freelance projects, and other earnings to get a
      complete financial picture.
    </p>
    <button onClick={onAddClick} className="add-first-btn">
      <PlusCircle size={18} />
      Add Your First Income Source
    </button>
  </div>
);

const IncomePage = () => {
  const { incomeSources, loading, refetchData } = useContext(DataContext);
  const { addNotification } = useContext(NotificationContext);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [editingSource, setEditingSource] = useState(null);

  const handleOpenModal = (source = null) => {
    setEditingSource(source);
    setFormModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingSource(null);
    setFormModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this income source?")) {
      try {
        await api.delete(`/income-sources/${id}`);
        addNotification("Income source deleted!", "success");
        await refetchData();
      } catch (err) {
        addNotification("Failed to delete income source.", err);
      }
    }
  };

  if (loading) {
    return <div className="loading-fullscreen">Loading Income...</div>;
  }

  return (
    <>
      <Modal isOpen={isFormModalOpen} onClose={handleCloseModal}>
        <IncomeSourceForm
          editingSource={editingSource}
          onClose={handleCloseModal}
        />
      </Modal>

      <div className="income-page-container">
        <header className="page-header">
          <div>
            <h1>Income Hub</h1>
            <p>A complete and clear picture of all the money you earn.</p>
          </div>
          <button className="add-income-btn" onClick={() => handleOpenModal()}>
            + Add Income Source
          </button>
        </header>

        {incomeSources && incomeSources.length > 0 && (
          <section className="page-section">
            <IncomeSummary incomeSources={incomeSources} />
          </section>
        )}

        <section className="page-section">
          <h3>Your Income Sources</h3>
          <div className="income-grid">
            {incomeSources && incomeSources.length > 0 ? (
              incomeSources.map((source) => (
                <IncomeCard
                  key={source._id}
                  source={source}
                  onEdit={handleOpenModal}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <EmptyState onAddClick={() => handleOpenModal()} />
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default IncomePage;
