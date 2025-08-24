// client/src/features/transactions/components/TransactionForm/TransactionForm.jsx

// --- Core Imports ---
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DataContext } from "@/context/DataContext";

/**
 * @component TransactionForm
 * @desc      A dynamic form for adding both one-time transactions and recurring commitments.
 * Its fields and options change based on user selections.
 */
const TransactionForm = () => {
  // --- Context & State ---
  // Access global data needed for dynamic dropdowns (goals, investments, etc.)
  const { goals, investments, transactions, refetchData } =
    useContext(DataContext);

  // State for the core form fields
  const [transactionType, setTransactionType] = useState("expense");
  const [paymentFrequency, setPaymentFrequency] = useState("one-time");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState("");

  // State to hold the dynamically changing options for the description field
  const [descriptionOptions, setDescriptionOptions] = useState([]);
  const [isCustomDescription, setIsCustomDescription] = useState(true);

  // --- Effects ---
  // This powerful effect runs whenever the `transactionType` changes.
  // It's responsible for updating the 'Description' field's behavior and options.
  useEffect(() => {
    // Reset description when type changes
    setDescription("");

    switch (transactionType) {
      // ===================================================================
      // == UPDATE: 2025-08-23 | Separate Income Feature ==
      // The "income" case has been removed from this form. Income is now managed
      // through a dedicated IncomeSource system.
      // case "income":
      //   setIsCustomDescription(false); // Use a dropdown for income
      //   setDescriptionOptions([
      //     { value: "Salary", label: "Salary" },
      //     { value: "Business", label: "Business" },
      //     { value: "Freelance", label: "Freelance" },
      //     { value: "Bonus", label: "Bonus" },
      //     { value: "Other", label: "Other" },
      //   ]);
      //   break;
      // ===================================================================

      case "savings":
        setIsCustomDescription(false); // Use a dropdown for savings
        // Populate options from the user's existing goals
        setDescriptionOptions(
          goals.map((g) => ({ value: g.goalName, label: g.goalName }))
        );
        break;
      case "investment":
        setIsCustomDescription(false); // Use a dropdown for investments
        // Populate options from the user's existing investments
        setDescriptionOptions(
          investments.map((i) => ({
            value: i.investmentName,
            label: i.investmentName,
          }))
        );
        break;
      case "expense":
      default:
        setIsCustomDescription(true); // Use a text input with autocomplete for expenses
        break;
    }
  }, [transactionType, goals, investments]); // Re-run if any of these change

  // --- Event Handlers ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount || !date) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");

    // This is the core logic that decides whether to create a
    // one-time transaction or a recurring commitment.
    if (paymentFrequency === "one-time") {
      // --- Handle One-Time Transaction ---
      try {
        const transactionData = {
          description,
          amount: parseFloat(amount),
          date,
          type: transactionType,
          category:
            transactionType === "expense" ? description : transactionType, // Simple category logic
        };
        await axios.post(
          "http://localhost:3001/api/transactions",
          transactionData
        );
        refetchData(); // Refresh all app data
        // Reset form
        setDescription("");
        setAmount("");
      } catch (err) {
        console.error("Failed to add transaction", err);
        setError("Failed to add transaction.");
      }
    } else {
      // --- Handle Recurring Commitment ---
      try {
        const commitmentData = {
          commitmentName: description,
          amount: parseFloat(amount),
          commitmentType: transactionType,
          frequency: paymentFrequency,
          startDate: date,
        };
        await axios.post(
          "http://localhost:3001/api/commitments",
          commitmentData
        );
        refetchData(); // Refresh all app data
        // Reset form
        setDescription("");
        setAmount("");
      } catch (err) {
        console.error("Failed to add commitment", err);
        setError("Failed to add recurring payment.");
      }
    }
  };

  // --- Helper Data ---
  // Create a unique list of past expense descriptions for the autocomplete feature.
  const expenseSuggestions = [
    ...new Set(
      transactions.filter((t) => t.type === "expense").map((t) => t.description)
    ),
  ];

  // --- JSX Render ---
  return (
    <form onSubmit={handleSubmit} className="universal-form">
      <h2>Add a New Transaction</h2>
      {error && <p className="error-message full-width">{error}</p>}
      <div className="form-grid">
        {/* Transaction Type Dropdown */}
        <div className="form-group">
          <label>Transaction Type</label>
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <option value="expense">Expense</option>
            {/* =================================================================== */}
            {/* == UPDATE: 2025-08-23 | Separate Income Feature == */}
            {/* The "Income" option has been removed from this dropdown. */}
            {/* <option value="income">Income</option> */}
            {/* =================================================================== */}
            <option value="savings">Savings</option>
            <option value="investment">Investment</option>
          </select>
        </div>

        {/* Payment Frequency Dropdown */}
        <div className="form-group">
          <label>Payment</label>
          <select
            value={paymentFrequency}
            onChange={(e) => setPaymentFrequency(e.target.value)}
          >
            <option value="one-time">One-time</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Dynamic Description Field */}
        <div className="form-group">
          <label>Description</label>
          {isCustomDescription ? (
            <>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Groceries, Petrol"
                list="expense-suggestions"
              />
              <datalist id="expense-suggestions">
                {expenseSuggestions.map((suggestion) => (
                  <option key={suggestion} value={suggestion} />
                ))}
              </datalist>
            </>
          ) : (
            <select
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            >
              <option value="">-- Select --</option>
              {descriptionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Amount and Date Fields */}
        <div className="form-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>
      <button type="submit" className="submit-btn full-width">
        + Add Transaction
      </button>
    </form>
  );
};

export default TransactionForm;
