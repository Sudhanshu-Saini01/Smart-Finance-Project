// client/src/pages/TransactionsPage.jsx
// /----- VERSION V3 -----/

import React, { useState, useContext } from "react";
import axios from "axios";
import { DataContext } from "../context/DataContext";
import UniversalForm from "../components/UniversalForm";
import AllocationModal from "../components/AllocationModal";
//-------- Start: Version V3.0.0---------//
import ExpensesBlueprint from "../components/ExpensesBlueprint"; // Import the new component
//-------- End: Version V3.0.0---------//
import "./TransactionsPage.css";

// // 2. The "checklist" for our universal form to add a transaction
// const transactionFormConfig = [
//   {
//     name: "description",
//     label: "Description (Spent On / Source)",
//     placeholder: "e.g., Monthly Salary, Groceries",
//     required: true,
//   },
//   { name: "amount", label: "Amount (₹)", type: "number", required: true },
//   {
//     name: "date",
//     label: "Date",
//     type: "date",
//     defaultValue: new Date().toISOString().split("T")[0],
//     required: true,
//   },
//   {
//     name: "type",
//     label: "Type",
//     type: "select",
//     options: [
//       { value: "expense", label: "Expense" },
//       { value: "income", label: "Income" },
//       { value: "savings", label: "Savings" },
//       { value: "investment", label: "Investment" },
//     ],
//   },
//   {
//     name: "category",
//     label: "Category",
//     type: "select",
//     options: [
//       { value: "Groceries", label: "Groceries" },
//       { value: "Rent", label: "Rent" },
//       { value: "Utilities", label: "Utilities" },
//       { value: "Transport", label: "Transport" },
//       { value: "Entertainment", label: "Entertainment" },
//       { value: "Salary", label: "Salary" },
//       { value: "Freelance", label: "Freelance" },
//       { value: "Bonus", label: "Bonus" },
//       { value: "Other", label: "Other" },
//     ],
//   },
// ];

const transactionFormConfig = [
  {
    name: "description",
    label: "Description",
    placeholder: "e.g., Monthly Salary, Groceries",
    required: true,
  },
  { name: "amount", label: "Amount (₹)", type: "number", required: true },
  {
    name: "date",
    label: "Date",
    type: "date",
    defaultValue: new Date().toISOString().split("T")[0],
    required: true,
  },
  {
    name: "type",
    label: "Type",
    type: "select",
    defaultValue: "expense",
    options: [
      { value: "expense", label: "Expense" },
      { value: "income", label: "Income" },
      { value: "savings", label: "Savings" },
      { value: "investment", label: "Investment" },
    ],
  },
  {
    name: "category",
    label: "Category",
    type: "select",
    defaultValue: "Other",
    options: [
      { value: "Groceries", label: "Groceries" },
      { value: "Rent", label: "Rent" },
      { value: "Utilities", label: "Utilities" },
      { value: "Transport", label: "Transport" },
      { value: "Entertainment", label: "Entertainment" },
      { value: "Salary", label: "Salary" },
      { value: "Freelance", label: "Freelance" },
      { value: "Bonus", label: "Bonus" },
      { value: "Other", label: "Other" },
    ],
  },
];

const TransactionsPage = () => {
  //-------- Start: Version V3.0.0---------//
  const { transactions, commitments, summary, loading, error, refetchData } =
    useContext(DataContext);
  //-------- End: Version V3.0.0---------//

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIncomeTx, setCurrentIncomeTx] = useState(null);

  const handleIncomeAdded = (incomeTx) => {
    setCurrentIncomeTx(incomeTx);
    setIsModalOpen(true);
  };

  // const { transactions, loading, error, refetchData } = useContext(DataContext);

  // 3. The function to handle the form submission
  const handleAddTransaction = async (formData) => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/transactions",
        formData
      );

      // If the new transaction was income, trigger the modal
      if (formData.type === "income") {
        handleIncomeAdded(res.data);
      } else {
        // Otherwise, just refetch all the data immediately
        refetchData();
      }
    } catch (err) {
      console.error("Failed to add transaction", err);
      alert("Failed to add transaction. Please try again.");
    }
  };

  // Logic to group transactions by month
  const groupedTransactions = transactions.reduce((acc, tx) => {
    const month = new Date(tx.date).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(tx);
    return acc;
  }, {});

  if (loading) {
    return <div className="loading-fullscreen">Loading Transactions...</div>;
  }

  return (
    <>
      <AllocationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        incomeTransaction={currentIncomeTx}
        onApply={refetchData}
      />

      <div className="transactions-page-container">
        <h1>Transactions Command Center</h1>

        {/*-------- Start: Version V3.0.0---------*/}
        <div className="transaction-section">
          <h3>Your Monthly Blueprint</h3>
          <ExpensesBlueprint commitments={commitments} summary={summary} />
        </div>
        {/*-------- End: Version V3.0.0---------*/}

        <div className="transaction-section">
          <UniversalForm
            title="Add a New Transaction"
            config={transactionFormConfig}
            onSubmit={handleAddTransaction}
            submitText="+ Add Transaction"
          />
        </div>

        <div className="transaction-section">
          <h3>Transaction History</h3>
          {error && <p className="error-message">{error}</p>}
          <div className="table-container">
            {Object.entries(groupedTransactions).map(([month, txs]) => (
              <div key={month}>
                <h4 className="month-separator">{month}</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txs.map((t) => (
                      <tr key={t._id}>
                        <td>{new Date(t.date).toLocaleDateString()}</td>
                        <td>{t.description}</td>
                        <td>{t.category}</td>
                        <td>
                          <span className={`type-pill ${t.type}`}>
                            {t.type}
                          </span>
                        </td>
                        <td className={`amount ${t.type}`}>
                          {t.type === "expense" ? "-" : "+"}
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                          }).format(t.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionsPage;
// /----- END VERSION V3 -----/
