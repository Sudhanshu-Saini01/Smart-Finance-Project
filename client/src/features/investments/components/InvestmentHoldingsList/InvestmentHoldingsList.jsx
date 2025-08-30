// client/src/features/investments/components/InvestmentHoldingsList/InvestmentHoldingsList.jsx
import React from "react";
import "./InvestmentHoldingsList.css";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    amount
  );

const InvestmentHoldingsList = ({ investments }) => {
  return (
    <div className="holdings-container">
      <h3>Your Holdings</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Amount Invested</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((inv) => (
              <tr key={inv._id}>
                <td>{inv.investmentName}</td>
                <td>
                  <span className="type-pill">{inv.investmentType}</span>
                </td>
                <td className="amount">{formatCurrency(inv.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvestmentHoldingsList;
