// // client/src/features/transactions/TransactionsPage.jsx

// import React, { useState, useContext } from "react";
// import { DataContext } from "@/context/DataContext";

// import Modal from "@/components/ui/Modal/Modal";
// import TransactionForm from "./components/TransactionForm/TransactionForm";
// import TransactionHistory from "./components/TransactionHistory/TransactionHistory";
// import ExpensesBlueprint from "@/features/dashboard/components/ExpensesBlueprint/ExpensesBlueprint";
// import "./TransactionsPage.css";

// const TransactionsPage = () => {
//   const { recurrings, summary, loading } = useContext(DataContext);
//   const [isFormModalOpen, setFormModalOpen] = useState(false);

//   if (loading) {
//     return <div className="loading-fullscreen">Loading Transactions...</div>;
//   }

//   return (
//     <>
//       <Modal isOpen={isFormModalOpen} onClose={() => setFormModalOpen(false)}>
//         <TransactionForm />
//       </Modal>

//       <div className="transactions-page-container">
//         <header className="transactions-header">
//           <div className="header-content">
//             <h1>Transactions</h1>
//             <p>Add new transactions and review your complete history.</p>
//           </div>
//           <button
//             className="add-transaction-btn"
//             onClick={() => setFormModalOpen(true)}
//           >
//             + Add Transaction
//           </button>
//         </header>

//         {/* --- NEW SINGLE-COLUMN LAYOUT --- */}
//         <div className="transactions-main-content">
//           {/* Monthly Blueprint is now at the top */}
//           <section className="transaction-section">
//             <h3>Monthly Blueprint</h3>
//             <ExpensesBlueprint recurrings={recurrings} summary={summary} />
//           </section>

//           {/* Transaction History is below the blueprint */}
//           <section className="transaction-section">
//             <TransactionHistory />
//           </section>
//         </div>
//       </div>
//     </>
//   );
// };

// export default TransactionsPage;

// client/src/features/transactions/TransactionsPage.jsx

import React, { useState, useContext } from "react";
import { DataContext } from "@/context/DataContext";
import api from "@/utils/api";
import Modal from "@/components/ui/Modal/Modal";
import TransactionForm from "./components/TransactionForm/TransactionForm";
import TransactionHistory from "./components/TransactionHistory/TransactionHistory";
import ExpensesBlueprint from "@/features/dashboard/components/ExpensesBlueprint/ExpensesBlueprint";
import "./TransactionsPage.css";

const TransactionsPage = () => {
  const { loading, refetchData } = useContext(DataContext);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormModalOpen(true);
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await api.delete(`/transactions/${transactionId}`);
        await refetchData();
      } catch (err) {
        alert("Could not delete the transaction.", err);
      }
    }
  };

  const handleCloseModal = () => {
    setFormModalOpen(false);
    setEditingTransaction(null);
  };

  // --- NEW: This function will be passed to the empty state button ---
  const handleOpenAddModal = () => {
    setEditingTransaction(null); // Ensure we're not in edit mode
    setFormModalOpen(true);
  };

  if (loading) {
    return <div className="loading-fullscreen">Loading Transactions...</div>;
  }

  return (
    <>
      <Modal isOpen={isFormModalOpen} onClose={handleCloseModal}>
        <TransactionForm
          editingTransaction={editingTransaction}
          onClose={handleCloseModal}
        />
      </Modal>

      <div className="transactions-page-container">
        <header className="transactions-header">
          <div className="header-content">
            <h1>Transactions</h1>
            <p>Add, edit, and review your complete history.</p>
          </div>
          {/* This button still works for existing users */}
          <button className="add-transaction-btn" onClick={handleOpenAddModal}>
            + Add Transaction
          </button>
        </header>

        <div className="transactions-main-content">
          <section className="transaction-section">
            <TransactionHistory
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddTransactionClick={handleOpenAddModal} // --- Pass the function down
            />
          </section>
        </div>
      </div>
    </>
  );
};

export default TransactionsPage;
