// client/src/features/expenses/components/FixedExpenseList/FixedExpenseList.jsx
import React from "react";
import "./FixedExpenseList.css";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    amount
  );

const FixedExpenseList = ({ recurrings }) => {
  const fixedExpenses = recurrings.filter((c) => c.recurringType === "expense");

  return (
    <div className="list-container">
      <h3>Your Recurring Expenses</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Next Due Date</th>
            </tr>
          </thead>
          <tbody>
            {fixedExpenses.map((item) => (
              <tr key={item._id}>
                <td>{item.recurringName}</td>
                <td className="amount">{formatCurrency(item.amount)}</td>
                <td>{new Date(item.nextDueDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FixedExpenseList;
