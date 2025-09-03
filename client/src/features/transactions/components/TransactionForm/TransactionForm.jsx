// client/src/features/transactions/components/TransactionForm/TransactionForm.jsx

import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "@/context/DataContext";
import { NotificationContext } from "@/context/NotificationContext";
import api from "@/utils/api";
import "./TransactionForm.css";

const TransactionForm = ({ editingTransaction, onClose }) => {
  const { recurrings, refetchData } = useContext(DataContext);
  const { addNotification } = useContext(NotificationContext);

  // State to manage which tab is active: 'payment' or 'manual'
  const [activeTab, setActiveTab] = useState("payment");

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [selectedRecurringId, setSelectedRecurringId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect to pre-fill the form and switch to the correct tab when editing
  useEffect(() => {
    if (editingTransaction) {
      setActiveTab("manual"); // Force manual tab for editing
      setFormData({
        description: editingTransaction.description,
        amount: editingTransaction.amount,
        type: editingTransaction.type,
        category: editingTransaction.category,
        date: new Date(editingTransaction.date).toISOString().split("T")[0],
      });
    } else {
      // When opening for "add", reset to the default tab and clear form
      setActiveTab("payment");
      setFormData({
        description: "",
        amount: "",
        type: "expense",
        category: "",
        date: new Date().toISOString().split("T")[0],
      });
      setSelectedRecurringId("");
    }
  }, [editingTransaction]);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSelectChange = (e) => {
    const recurringId = e.target.value;
    setSelectedRecurringId(recurringId);
    if (recurringId) {
      const selected = recurrings.find((c) => c._id === recurringId);
      if (selected) {
        setFormData({
          description: selected.recurringName,
          amount: selected.amount,
          type:
            selected.recurringType === "savings" ||
            selected.recurringType === "investment"
              ? selected.recurringType
              : "expense",
          category: selected.recurringType,
          date: new Date().toISOString().split("T")[0],
        });
      }
    } else {
      setFormData({
        description: "",
        amount: "",
        type: "expense",
        category: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingTransaction) {
        await api.put(`/transactions/${editingTransaction._id}`, formData);
        addNotification("Transaction updated successfully!", "success");
      } else {
        await api.post("/transactions", formData);
        addNotification("Transaction created successfully!", "success");
      }
      await refetchData();
      onClose();
    } catch (err) {
      addNotification("An error occurred. Please try again.", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="transaction-form-container">
      <h3>{editingTransaction ? "Edit Transaction" : "New Transaction"}</h3>

      {/* --- TABS (only show when adding new, not editing) --- */}
      {!editingTransaction && (
        <div className="form-tabs">
          <button
            onClick={() => setActiveTab("payment")}
            className={`tab-button ${activeTab === "payment" ? "active" : ""}`}
          >
            Make a Payment
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={`tab-button ${activeTab === "manual" ? "active" : ""}`}
          >
            Manual Entry
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* --- PAYMENT TAB VIEW --- */}
        {activeTab === "payment" && !editingTransaction && (
          <div className="form-content">
            <div className="form-group">
              <label>Choose a Recurring Payment</label>
              <select value={selectedRecurringId} onChange={handleSelectChange}>
                <option value="">-- Choose a bill or subscription --</option>
                {recurrings.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.recurringName}
                  </option>
                ))}
              </select>
            </div>
            {selectedRecurringId && <hr className="form-divider" />}
            <div className="form-group">
              <label>Description</label>
              <input type="text" value={formData.description} readOnly />
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input type="text" value={formData.amount} readOnly />
            </div>
          </div>
        )}

        {/* --- MANUAL ENTRY / EDIT TAB VIEW --- */}
        {activeTab === "manual" && (
          <div className="form-content">
            <div className="form-group">
              <label>Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="form-submit-btn"
          disabled={
            isSubmitting || (activeTab === "payment" && !selectedRecurringId)
          }
        >
          {isSubmitting
            ? "Saving..."
            : editingTransaction
            ? "Save Changes"
            : "Add Transaction"}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
