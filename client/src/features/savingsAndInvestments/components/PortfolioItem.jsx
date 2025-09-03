// client/src/features/savingsAndInvestments/components/PortfolioItem.jsx

import React, { useState, useMemo } from "react";
import { DataContext } from "@/context/DataContext";
import "./PortfolioItem.css";

/**
 * @component PortfolioItem
 * @desc      An interactive card for displaying a single savings or investment recurring.
 */
const PortfolioItem = ({ item }) => {
  const { transactions } = React.useContext(DataContext);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  // This logic finds all past transactions related to this specific recurring.
  // `useMemo` is used for performance, so this calculation only runs when needed.
  const history = useMemo(() => {
    return transactions
      .filter((t) => t.description === item.recurringName)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, item.recurringName]);

  const totalContributed = history.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="info-card" data-type={item.recurringType}>
      <div className="info-card-header">
        <h4>{item.recurringName}</h4>
        <span className={`type-pill ${item.recurringType}`}>
          {item.recurringType}
        </span>
      </div>
      <div className="info-card-body">
        <div className="primary-stat">
          <label>Total Contributed</label>
          <span>
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(totalContributed)}
          </span>
        </div>
        <div className="primary-stat">
          <label>Recurring Amount</label>
          <span>
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(item.amount)}{" "}
            / {item.frequency}
          </span>
        </div>
      </div>
      <div className="info-card-footer">
        <button onClick={() => setIsDetailsVisible(!isDetailsVisible)}>
          {isDetailsVisible ? "Hide Details" : "View Details..."}
        </button>
        <button onClick={() => setIsHistoryVisible(!isHistoryVisible)}>
          Transaction History ({history.length})
        </button>
      </div>
      {isDetailsVisible && (
        <div className="details-section">
          <p>
            <strong>Start Date:</strong>{" "}
            {new Date(item.startDate).toLocaleDateString()}
          </p>
          {item.endDate && (
            <p>
              <strong>End Date:</strong>{" "}
              {new Date(item.endDate).toLocaleDateString()}
            </p>
          )}
          {item.expectedRoi > 0 && (
            <p>
              <strong>Expected ROI:</strong> {item.expectedRoi}% p.a.
            </p>
          )}
        </div>
      )}
      {isHistoryVisible && (
        <div className="history-section">
          <h5>Transaction History</h5>
          {history.length > 0 ? (
            <div className="table-container">
              <table>
                <tbody>
                  {history.slice(0, 10).map((t) => (
                    <tr key={t._id}>
                      <td>{new Date(t.date).toLocaleDateString()}</td>
                      <td className="amount income">
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
          ) : (
            <p>No transactions found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PortfolioItem;
