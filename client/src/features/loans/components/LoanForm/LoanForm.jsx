// client/src/features/loans/components/LoanForm/LoanForm.jsx

import React, { useContext } from "react";
import { DataContext } from "@/context/DataContext";
import UniversalForm from "@/features/transactions/components/UniversalForm/UniversalForm";
import api from "@/utils/api";

const loanFormConfig = [
  // ... (Your entire loanFormConfig array remains unchanged here) ...
  {
    name: "loanName",
    label: "Loan Name",
    placeholder: "e.g., Car Loan",
    required: true,
  },
  {
    name: "lender",
    label: "Lender",
    placeholder: "e.g., SBI Bank",
    required: true,
  },
  {
    name: "totalAmount",
    label: "Total Amount (₹)",
    type: "number",
    required: true,
  },
  {
    name: "interestRate",
    label: "Interest Rate (%)",
    type: "number",
    required: true,
  },
  { name: "emi", label: "Monthly EMI (₹)", type: "number", required: true },
  {
    name: "startDate",
    label: "Start Date",
    type: "date",
    required: true,
    defaultValue: new Date().toISOString().split("T")[0],
  },
  { name: "endDate", label: "End Date", type: "date", required: true },
  {
    name: "assetType",
    label: "Asset Type",
    type: "select",
    defaultValue: "neutral",
    options: [
      { value: "depreciating", label: "Depreciating (Car, Electronics)" },
      { value: "appreciating", label: "Appreciating (Property)" },
      { value: "neutral", label: "Neutral (Education, Personal)" },
    ],
  },
];

const LoanForm = ({ onClose }) => {
  const { refetchData } = useContext(DataContext);

  const handleAddLoan = async (formData) => {
    try {
      await api.post("/loans", formData);
      await refetchData();
      onClose(); // Close the modal on success
    } catch (err) {
      console.error("Failed to add loan", err);
      alert("Failed to add loan.");
    }
  };

  return (
    <UniversalForm
      title="Add a New Loan"
      config={loanFormConfig}
      onSubmit={handleAddLoan}
      submitText="Add Loan"
    />
  );
};

export default LoanForm;
