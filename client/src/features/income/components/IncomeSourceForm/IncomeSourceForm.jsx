// client/src/features/income/components/IncomeSourceForm/IncomeSourceForm.jsx

import React, { useState, useContext } from "react";
import { DataContext } from "@/context/DataContext";
import api from "@/utils/api";
import "./IncomeSourceForm.css";

const IncomeSourceForm = ({ onClose }) => {
  const { refetchData } = useContext(DataContext);
  const [incomeType, setIncomeType] = useState("Salary"); // State to control the form type
  // Form data state is now more flexible
  const [formData, setFormData] = useState({
    sourceName: "",
    grossAmount: "",
    netAmount: "",
    amount: "", // For non-salary income
    frequency: "monthly",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    // Construct the payload based on the income type
    const payload = {
      sourceName: formData.sourceName,
      incomeType: incomeType,
      frequency: formData.frequency,
      ...(incomeType === "Salary"
        ? { grossAmount: formData.grossAmount, netAmount: formData.netAmount }
        : { grossAmount: formData.amount, netAmount: formData.amount }), // For others, gross and net are the same
    };

    try {
      await api.post("/income-sources", payload);
      setMessage("Income source added!");
      await refetchData();
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setMessage("Error adding income source.", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="income-form-container">
      <h3>Add New Income Source</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Income Type</label>
          <select
            value={incomeType}
            onChange={(e) => setIncomeType(e.target.value)}
          >
            <option>Salary</option>
            <option>Freelance</option>
            <option>Investment</option>
            <option>Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Source Name</label>
          <input
            type="text"
            name="sourceName"
            value={formData.sourceName}
            onChange={handleChange}
            placeholder="e.g., Company ABC"
            required
          />
        </div>

        {/* --- DYNAMIC FIELDS --- */}
        {incomeType === "Salary" ? (
          <div className="form-group-row">
            <div className="form-group">
              <label>Gross Amount</label>
              <input
                type="number"
                name="grossAmount"
                value={formData.grossAmount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Net In-Hand</label>
              <input
                type="number"
                name="netAmount"
                value={formData.netAmount}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        ) : (
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <button
          type="submit"
          className="form-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Income Source"}
        </button>
        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
};

export default IncomeSourceForm;
