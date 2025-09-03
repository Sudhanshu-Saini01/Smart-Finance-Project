// client/src/features/income/components/IncomeSourceForm/IncomeSourceForm.jsx

import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "@/context/DataContext";
import { NotificationContext } from "@/context/NotificationContext";
import api from "@/utils/api";
import "./IncomeSourceForm.css";

const IncomeSourceForm = ({ editingSource, onClose }) => {
  const { refetchData } = useContext(DataContext);
  const { addNotification } = useContext(NotificationContext);

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
  // const [message, setMessage] = useState("");

  // This useEffect hook runs whenever the 'editingSource' prop changes.
  useEffect(() => {
    if (editingSource) {
      // If we are editing, pre-fill the form with the existing data
      setIncomeType(editingSource.incomeType);
      setFormData({
        sourceName: editingSource.sourceName,
        grossAmount: editingSource.grossAmount,
        netAmount: editingSource.netAmount,
        amount:
          editingSource.incomeType !== "Salary" ? editingSource.netAmount : "",
        frequency: editingSource.frequency,
      });
    } else {
      // If we are adding a new source, ensure the form is blank
      setIncomeType("Salary");
      setFormData({
        sourceName: "",
        grossAmount: "",
        netAmount: "",
        amount: "",
        frequency: "monthly",
      });
    }
  }, [editingSource]); // This effect depends on the editingSource prop

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // setMessage("");

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
      if (editingSource) {
        // If editing, send a PUT request to update the data
        await api.put(`/income-sources/${editingSource._id}`, payload);
        addNotification("Income source updated successfully!", "success");
      } else {
        // If creating, send a POST request
        await api.post("/income-sources", payload);
        addNotification("Income source added successfully!", "success");
      }
      await refetchData();
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred.";
      addNotification(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="income-form-container">
      {/* <h3>Add New Income Source</h3> */}
      <h3>{editingSource ? "Edit Income Source" : "Add New Income Source"}</h3>
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
          {/* {isSubmitting ? "Saving..." : "Save Income Source"} */}
          {isSubmitting
            ? "Saving..."
            : editingSource
            ? "Save Changes"
            : "Save Income Source"}
        </button>
        {/* {message && <p className="form-message">{message}</p>} */}
      </form>
    </div>
  );
};

export default IncomeSourceForm;
