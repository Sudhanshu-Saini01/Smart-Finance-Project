// // client/src/features/transactions/components/TransactionHistory/TransactionHistory.jsx

// import React, { useState, useMemo, useContext } from "react";
// import { DataContext } from "@/context/DataContext";
// import "./TransactionHistory.css";

// const TransactionHistory = () => {
//   const { transactions, loading, error } = useContext(DataContext);
//   const [visibleMonthsCount, setVisibleMonthsCount] = useState(3);

//   const groupedTransactions = useMemo(() => {
//     if (!Array.isArray(transactions)) return {};
//     return transactions.reduce((acc, tx) => {
//       const month = new Date(tx.date).toLocaleString("default", {
//         month: "long",
//         year: "numeric",
//       });
//       if (!acc[month]) acc[month] = [];
//       acc[month].push(tx);
//       return acc;
//     }, {});
//   }, [transactions]);

//   const months = Object.entries(groupedTransactions);

//   if (loading) {
//     return <p>Loading history...</p>;
//   }

//   return (
//     <div className="transaction-history-container">
//       <h3>Transaction History</h3>
//       {error && <p className="error-message">{error}</p>}

//       <div className="table-container">
//         {months.slice(0, visibleMonthsCount).map(([month, txs]) => (
//           <div key={month} className="month-group">
//             <h4 className="month-separator">{month}</h4>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Date</th>
//                   <th>Description</th>
//                   <th>Category</th>
//                   <th>Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {txs.map((t) => (
//                   <tr key={t._id}>
//                     <td>{new Date(t.date).toLocaleDateString()}</td>
//                     <td>{t.description}</td>
//                     <td>{t.category}</td>
//                     <td className={`amount ${t.type}`}>
//                       {t.type === "expense" ? "-" : "+"}
//                       {new Intl.NumberFormat("en-IN", {
//                         style: "currency",
//                         currency: "INR",
//                       }).format(t.amount)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ))}
//       </div>

//       {months.length === 0 && !loading && <p>No transactions found.</p>}

//       {months.length > visibleMonthsCount && (
//         <button
//           onClick={() => setVisibleMonthsCount((prev) => prev + 3)}
//           className="load-more-btn"
//         >
//           Load More...
//         </button>
//       )}
//     </div>
//   );
// };

// export default TransactionHistory;

// client/src/features/transactions/components/TransactionHistory/TransactionHistory.jsx

import React, { useState, useMemo, useContext } from "react";
import { DataContext } from "@/context/DataContext";
import { Pencil, Trash2 } from "lucide-react";
import "./TransactionHistory.css";


// --- NEW: An "Actionable" component for the empty state ---
const ActionableEmptyState = ({ onAddClick }) => (
  <div className="actionable-empty-state">
    <div className="empty-state-icon">
      <ArrowRightLeft size={48} strokeWidth={1.5} />
    </div>
    <h3>No Transactions Yet</h3>
    <p>Your transaction history will appear here once you add your first one.</p>
    <button onClick={onAddClick} className="add-first-btn">
      <PlusCircle size={18} />
      Add Your First Transaction
    </button>
  </div>
);


// --- NEW: A dedicated component for the "empty state" ---
const SampleState = () => (
  <div className="sample-state-container">
    <div className="sample-state-overlay">
      <h4>This is a preview</h4>
      <p>Your real transactions will appear here. Add one to get started!</p>
    </div>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{new Date().toLocaleDateString()}</td>
          <td>Welcome Salary</td>
          <td>Salary</td>
          <td className="amount income">
            +{" "}
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(75000)}
          </td>
          <td className="action-cell disabled">
            <Pencil size={16} />
            <Trash2 size={16} />
          </td>
        </tr>
        <tr>
          <td>{new Date().toLocaleDateString()}</td>
          <td>Netflix Subscription</td>
          <td>Entertainment</td>
          <td className="amount expense">
            -{" "}
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(499)}
          </td>
          <td className="action-cell disabled">
            <Pencil size={16} />
            <Trash2 size={16} />
          </td>
        </tr>
        <tr>
          <td>{new Date().toLocaleDateString()}</td>
          <td>Swiggy Order</td>
          <td>Food</td>
          <td className="amount expense">
            -{" "}
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(350)}
          </td>
          <td className="action-cell disabled">
            <Pencil size={16} />
            <Trash2 size={16} />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

const TransactionHistory = ({ onEdit, onDelete }) => {
  const { transactions, loading, error } = useContext(DataContext);
  const [visibleMonthsCount, setVisibleMonthsCount] = useState(3);

  const groupedTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) return {};
    return transactions.reduce((acc, tx) => {
      const month = new Date(tx.date).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      if (!acc[month]) acc[month] = [];
      acc[month].push(tx);
      return acc;
    }, {});
  }, [transactions]);

  const months = Object.entries(groupedTransactions);

  if (loading) {
    return <p>Loading history...</p>;
  }

  return (
    <div className="transaction-history-container">
      <h3>Transaction History</h3>
      {error && <p className="error-message">{error}</p>}

      {/* --- NEW LOGIC: Show sample data if there are no real transactions --- */}
      {months.length === 0 ? (
        <SampleState />
      ) : (
        <>
          <div className="table-container">
            {months.slice(0, visibleMonthsCount).map(([month, txs]) => (
              <div key={month} className="month-group">
                <h4 className="month-separator">{month}</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txs.map((t) => (
                      <tr key={t._id}>
                        <td>{new Date(t.date).toLocaleDateString()}</td>
                        <td>{t.description}</td>
                        <td>{t.category}</td>
                        <td className={`amount ${t.type}`}>
                          {t.type === "expense" ? "-" : "+"}
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                          }).format(t.amount)}
                        </td>
                        <td className="action-cell">
                          <button
                            onClick={() => onEdit(t)}
                            className="action-btn edit-btn"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => onDelete(t._id)}
                            className="action-btn delete-btn"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          {months.length > visibleMonthsCount && (
            <button
              onClick={() => setVisibleMonthsCount((prev) => prev + 3)}
              className="load-more-btn"
            >
              Load More...
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionHistory;
