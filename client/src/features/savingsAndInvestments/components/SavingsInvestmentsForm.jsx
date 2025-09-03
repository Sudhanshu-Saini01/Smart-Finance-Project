// client/src/features/savingsAndInvestments/components/SavingsInvestmentsForm.jsx

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DataContext } from "@/context/DataContext";

/**
 * @component SavingsInvestmentsForm
 * @desc      A smart, dynamic form for creating and managing recurring recurrings.
 * It can be pre-filled from the Goals page or used directly.
 * @param {object} { prefilledGoal } - An object containing the ID and name of a goal to pre-fill the form with.
 */
const SavingsInvestmentsForm = ({ prefilledGoal }) => {
  // --- Context & State ---
  const { goals, investments, refetchData } = useContext(DataContext);

  // Form field states
  const [type, setType] = useState("savings");
  const [payment, setPayment] = useState("monthly");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState("");
  const [roi, setRoi] = useState("");
  const [error, setError] = useState("");

  // State for autocomplete/dropdown options
  const [options, setOptions] = useState([]);

  // --- Effects ---
  // This is the main effect that controls the form's behavior.
  useEffect(() => {
    // SCENARIO 1: The form is pre-filled from the Goals page.
    if (prefilledGoal) {
      setType("savings"); // Lock the type to "savings".
      setName(prefilledGoal.name); // Pre-fill the goal's name.
      // Set the dropdown options to only the pre-filled goal to prevent changes.
      setOptions([{ value: prefilledGoal.name, label: prefilledGoal.name }]);
    } else {
      // SCENARIO 2: The form is being used directly.
      // It dynamically sets the autocomplete suggestions based on the selected type.
      if (type === "savings") {
        setOptions(
          goals.map((g) => ({ value: g.goalName, label: g.goalName }))
        );
      } else {
        setOptions(
          investments.map((i) => ({
            value: i.investmentName,
            label: i.investmentName,
          }))
        );
      }
      // We reset the name field whenever the type changes to avoid mismatches.
      setName("");
    }
  }, [type, goals, investments, prefilledGoal]); // This effect re-runs if any of these dependencies change.

  // --- Event Handlers ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !amount || !startDate) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");

    try {
      const recurringData = {
        recurringName: name,
        amount: parseFloat(amount),
        recurringType: type,
        frequency: payment,
        startDate,
        endDate: endDate || null,
        expectedRoi: roi || 0,
        // This is the crucial link: if the form was pre-filled, we send the goal's ID to the server.
        linkedGoal: prefilledGoal ? prefilledGoal.id : null,
      };
      await axios.post("https://smart-finance-project.onrender.com/api/recurrings", recurringData);
      refetchData();

      // Reset the form fields after submission.
      if (!prefilledGoal) setName(""); // Only reset the name if it wasn't pre-filled.
      setAmount("");
      setEndDate("");
      setRoi("");
    } catch (err) {
      console.error("Failed to create recurring", err);
      setError("Failed to create recurring.");
    }
  };

  // --- JSX Render ---
  return (
    <form onSubmit={handleSubmit} className="universal-form">
      <h3>Add New Savings or Investment</h3>
      {error && <p className="error-message full-width">{error}</p>}
      <div className="form-grid">
        <div className="form-group">
          <label>Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={!!prefilledGoal}
          >
            <option value="savings">Savings</option>
            <option value="investment">Investment</option>
          </select>
        </div>
        <div className="form-group">
          <label>Payment</label>
          <select value={payment} onChange={(e) => setPayment(e.target.value)}>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="daily">Daily</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
            <option value="one-time">One-time</option>
          </select>
        </div>
        <div className="form-group full-width">
          <label>Name</label>
          {/*
            This is now a smart field. If pre-filled, it's a disabled dropdown.
            Otherwise, it's a text input with autocomplete suggestions.
          */}
          {prefilledGoal ? (
            <input type="text" value={name} disabled />
          ) : (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Type or select a name..."
                list="name-suggestions"
                required
              />
              <datalist id="name-suggestions">
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value} />
                ))}
              </datalist>
            </>
          )}
        </div>
        <div className="form-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>End Date (Optional)</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Expected ROI (%)</label>
          <input
            type="number"
            value={roi}
            onChange={(e) => setRoi(e.target.value)}
          />
        </div>
      </div>
      <button type="submit" className="submit-btn full-width">
        Create Recurring
      </button>
    </form>
  );
};

export default SavingsInvestmentsForm;
