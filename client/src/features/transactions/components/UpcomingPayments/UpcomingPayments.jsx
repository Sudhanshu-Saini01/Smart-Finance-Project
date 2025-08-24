// client/src/features/transactions/components/UpcomingPayments/UpcomingPayments.jsx

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DataContext } from "@/context/DataContext";
import { NotificationContext } from "@/context/NotificationContext";
import "./UpcomingPayments.css"; // We will create this new CSS file next.

const UpcomingPayments = ({ simulatedDate }) => {
  const { goals, refetchData } = useContext(DataContext);
  const { showNotification } = useContext(NotificationContext);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUpcoming = async () => {
      if (!simulatedDate) return;
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:3001/api/commitments/upcoming",
          {
            params: { currentDate: simulatedDate },
          }
        );
        setUpcoming(res.data);
      } catch (err) {
        console.error("Failed to fetch upcoming payments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, [simulatedDate, refetchData]);

  const handleExecute = async (commitment) => {
    try {
      await axios.post(
        `http://localhost:3001/api/commitments/${commitment._id}/execute`,
        {
          executionDate: simulatedDate,
        }
      );
      const formattedAmount = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(commitment.amount);
      showNotification({
        title: "✅ Payment Successful!",
        message: `Your payment for '${commitment.commitmentName}' of ${formattedAmount} has been processed.`,
      });
      await refetchData();
    } catch (err) {
      showNotification({
        title: "❌ Payment Failed",
        message: "There was an error processing your payment.",
        type: "error",
        err,
      });
    }
  };

  const handleSkip = async (commitment) => {
    try {
      // This makes an API call to a new endpoint that we will need to create on the server.
      // It tells the server to update the commitment's lastExecutionDate without creating a transaction.
      await axios.put(
        `http://localhost:3001/api/commitments/${commitment._id}/skip`,
        {
          skipDate: simulatedDate,
        }
      );
      showNotification({
        title: "ℹ️ Payment Skipped",
        message: `The payment for '${commitment.commitmentName}' has been skipped for this period.`,
      });
      await refetchData();
    } catch (err) {
      showNotification({
        title: "❌ Skip Failed",
        message: "There was an error skipping this payment.",
        type: "error",
        err,
      });
    }
  };

  if (loading) return <p>Checking for upcoming payments...</p>;
  if (upcoming.length === 0)
    return (
      <div className="empty-state">
        <p>No payments are due on or before the selected date.</p>
      </div>
    );

  return (
    <div className="upcoming-payments-list">
      {upcoming.map((p) => {
        const linkedGoal = p.linkedGoal
          ? goals.find((g) => g._id === p.linkedGoal)
          : null;
        const progress = linkedGoal
          ? (linkedGoal.currentAmount / linkedGoal.targetAmount) * 100
          : 0;

        return (
          <div key={p._id} className="payment-card">
            <div className="card-header">
              <h4>{p.commitmentName}</h4>
              <span className={`type-pill ${p.commitmentType}`}>
                {p.commitmentType}
              </span>
            </div>
            <div className="card-body">
              <p className="due-date">
                Due:{" "}
                {new Date(simulatedDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="amount">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(p.amount)}
              </p>
              {linkedGoal && (
                <div className="goal-progress">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span>{Math.round(progress)}% Funded</span>
                </div>
              )}
            </div>
            <div className="card-actions">
              <button onClick={() => handleSkip(p)} className="btn-secondary">
                Skip This Month
              </button>
              <button onClick={() => handleExecute(p)} className="btn-primary">
                Pay Now
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UpcomingPayments;
