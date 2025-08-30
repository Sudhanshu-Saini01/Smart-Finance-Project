// // client/src/features/transactions/components/TransactionForm/TransactionForm.jsx

// import React, { useState, useContext } from "react";
// import { DataContext } from "@/context/DataContext";
// import api from "@/utils/api"; // We'll use our central API instance
// import "./TransactionForm.css"; // We'll create this next

// const TransactionForm = () => {
//   // Get commitments and the refetch function from our global data context
//   const { commitments, refetchData } = useContext(DataContext);

//   // State to hold the form data
//   const [formData, setFormData] = useState({
//     description: "",
//     amount: "",
//     type: "expense", // Most payments are expenses
//     category: "",
//     date: new Date().toISOString().split("T")[0], // Default to today
//   });

//   // State to track which commitment is selected from the dropdown
//   const [selectedCommitmentId, setSelectedCommitmentId] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [message, setMessage] = useState("");

//   // This is the core logic. It runs when the user selects a commitment.
//   const handleSelectChange = (e) => {
//     const commitmentId = e.target.value;
//     setSelectedCommitmentId(commitmentId);

//     if (commitmentId) {
//       // Find the full commitment object from our context data
//       const selected = commitments.find((c) => c._id === commitmentId);
//       if (selected) {
//         // Auto-populate the form data
//         setFormData({
//           description: selected.commitmentName,
//           amount: selected.amount,
//           type:
//             selected.commitmentType === "savings" ||
//             selected.commitmentType === "investment"
//               ? selected.commitmentType
//               : "expense",
//           category: selected.commitmentType, // Default category to the commitment type
//           date: new Date().toISOString().split("T")[0],
//         });
//       }
//     } else {
//       // If the user selects "Choose a payment...", clear the form
//       setFormData({
//         description: "",
//         amount: "",
//         type: "expense",
//         category: "",
//         date: new Date().toISOString().split("T")[0],
//       });
//     }
//   };

//   // Handles form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedCommitmentId) return;

//     setIsSubmitting(true);
//     setMessage("");
//     try {
//       // Send the new transaction data to the backend API
//       await api.post("/transactions", formData);

//       setMessage("Payment recorded successfully!");
//       // Reset the form
//       setSelectedCommitmentId("");
//       setFormData({
//         description: "",
//         amount: "",
//         type: "expense",
//         category: "",
//         date: new Date().toISOString().split("T")[0],
//       });

//       // IMPORTANT: Trigger a global data refresh to update the transaction history and dashboard
//       await refetchData();
//     } catch (err) {
//       setMessage("Error recording payment. Please try again.");
//       console.error(err);
//     } finally {
//       setIsSubmitting(false);
//       // Make the success message disappear after 3 seconds
//       setTimeout(() => setMessage(""), 3000);
//     }
//   };

//   return (
//     <div className="transaction-form-container">
//       <h3>Make a Payment</h3>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="commitment-select">Choose a Recurring Payment</label>
//           <select
//             id="commitment-select"
//             value={selectedCommitmentId}
//             onChange={handleSelectChange}
//           >
//             <option value="">-- Choose a payment --</option>
//             {commitments.map((c) => (
//               <option key={c._id} value={c._id}>
//                 {c.commitmentName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* This divider visually separates the selection from the auto-filled details */}
//         {selectedCommitmentId && <hr className="form-divider" />}

//         {/* These fields are now read-only, as they are auto-filled */}
//         <div className="form-group">
//           <label>Description</label>
//           <input type="text" value={formData.description} readOnly />
//         </div>
//         <div className="form-group">
//           <label>Amount</label>
//           <input type="text" value={formData.amount} readOnly />
//         </div>
//         <div className="form-group">
//           <label>Category</label>
//           <input type="text" value={formData.category} readOnly />
//         </div>

//         <button
//           type="submit"
//           className="form-submit-btn"
//           disabled={!selectedCommitmentId || isSubmitting}
//         >
//           {isSubmitting ? "Recording..." : "Confirm Payment"}
//         </button>

//         {message && <p className="form-message">{message}</p>}
//       </form>
//     </div>
//   );
// };

// export default TransactionForm;

// client/src/features/transactions/components/TransactionForm/TransactionForm.jsx

import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "@/context/DataContext";
import api from "@/utils/api";
import "./TransactionForm.css";

const TransactionForm = ({ editingTransaction, onClose }) => {
  const { refetchData } = useContext(DataContext);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense",
    category: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // This effect pre-fills the form if we are in "edit mode"
  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        description: editingTransaction.description,
        amount: editingTransaction.amount,
        type: editingTransaction.type,
        category: editingTransaction.category,
        date: new Date(editingTransaction.date).toISOString().split("T")[0],
      });
    } else {
      // If we are in "add mode", ensure the form is reset
      setFormData({
        description: "",
        amount: "",
        type: "expense",
        category: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [editingTransaction]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    try {
      if (editingTransaction) {
        await api.put(`/transactions/${editingTransaction._id}`, formData);
        setMessage("Transaction updated!");
      } else {
        await api.post("/transactions", formData);
        setMessage("Transaction created!");
      }
      await refetchData();
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setMessage("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- A SINGLE, UNIFIED FORM ---
  return (
    <div className="transaction-form-container">
      {/* The title changes based on whether we are editing or adding */}
      <h3>{editingTransaction ? "Edit Transaction" : "Add New Transaction"}</h3>
      <form onSubmit={handleSubmit}>
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
            placeholder="e.g., Coffee with friend"
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
            placeholder="e.g., Food"
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
            placeholder="e.g., 250"
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

        <button
          type="submit"
          className="form-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : editingTransaction
            ? "Save Changes"
            : "Add Transaction"}
        </button>
        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
};

export default TransactionForm;
