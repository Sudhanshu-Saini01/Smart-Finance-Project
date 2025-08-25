// client/src/components/ui/UpcomingPayments/UpcomingPayments.jsx

import React from "react";
import { groupAndSortPayments } from "@/utils/dateUtils";
import "./UpcomingPayments.css";

const UpcomingPayments = ({ commitments, loans }) => {
  // Combine and process commitments and loans
  const upcomingPayments = [...commitments, ...loans];
  const groupedPayments = groupAndSortPayments(upcomingPayments);

  const getStatusClass = (status) => {
    if (!status) return "status-default";
    return `status-${status.toLowerCase().replace(" ", "-")}`;
  };

  const renderPaymentItem = (item, index) => (
    <li key={index} className="payment-item">
      <div className="payment-details">
        <span className="payment-name">
          {item.commitmentName || item.loanName}
        </span>
        <span className="payment-type">
          {item.commitmentName ? "Commitment" : "Loan"}
        </span>
      </div>
      <div className="payment-amount">
        {new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(item.amount)}
      </div>
      <div className={`payment-status ${getStatusClass(item.status)}`}>
        {item.status || "Upcoming"}
      </div>
    </li>
  );

  return (
    <div className="upcoming-payments-card">
      <h4>Upcoming Payments</h4>
      <div className="payments-timeline">
        {Object.keys(groupedPayments).length > 0 ? (
          Object.entries(groupedPayments).map(([group, payments]) => (
            <div key={group} className="payment-group">
              <h5>{group}</h5>
              <ul className="payment-list">
                {payments.map(renderPaymentItem)}
              </ul>
            </div>
          ))
        ) : (
          <p className="no-payments-message">No upcoming payments found.</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingPayments;
