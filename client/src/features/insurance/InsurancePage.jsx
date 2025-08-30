// client/src/features/insurance/InsurancePage.jsx
import React, { useState, useContext } from "react";
import { DataContext } from "@/context/DataContext";
import Modal from "@/components/ui/Modal/Modal";
import InsuranceCard from "./components/InsuranceCard/InsuranceCard";
import InsuranceForm from "./components/InsuranceForm/InsuranceForm";
import "./InsurancePage.css";

const InsurancePage = () => {
  // In a real app, you would have an `insurances` array in your DataContext
  // For now, we'll use some placeholder data.
  const { loading } = useContext(DataContext);
  const insurances = [
    {
      _id: "1",
      policyName: "Family Health Plan",
      policyType: "Health",
      provider: "HDFC Ergo",
      policyNumber: "H12345",
      coverageAmount: 1000000,
      premiumAmount: 15000,
      nextDueDate: "2026-06-15",
    },
    {
      _id: "2",
      policyName: "Term Life Insurance",
      policyType: "Life",
      provider: "LIC",
      policyNumber: "L67890",
      coverageAmount: 5000000,
      premiumAmount: 22000,
      nextDueDate: "2026-08-01",
    },
  ];

  const [isFormModalOpen, setFormModalOpen] = useState(false);

  if (loading) {
    return <div className="loading-fullscreen">Loading Insurance...</div>;
  }

  return (
    <>
      <Modal isOpen={isFormModalOpen} onClose={() => setFormModalOpen(false)}>
        <InsuranceForm onClose={() => setFormModalOpen(false)} />
      </Modal>

      <div className="insurance-page-container">
        <header className="page-header">
          <div>
            <h1>Insurance Hub</h1>
            <p>Manage and track all your insurance policies in one place.</p>
          </div>
          <button
            className="add-policy-btn"
            onClick={() => setFormModalOpen(true)}
          >
            + Add Policy
          </button>
        </header>

        <div className="policy-grid">
          {insurances.length > 0 ? (
            insurances.map((policy) => (
              <InsuranceCard key={policy._id} policy={policy} />
            ))
          ) : (
            <p>No insurance policies added yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default InsurancePage;
