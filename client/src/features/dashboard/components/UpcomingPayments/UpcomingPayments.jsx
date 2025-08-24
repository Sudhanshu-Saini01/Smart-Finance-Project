// client/src/features/transactions/components/UpcomingPayments/UpcomingPayments.jsx

// --- Core Imports ---
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DataContext } from "@/context/DataContext";

/**
 * @component UpcomingPayments
 * @desc      Displays a list of scheduled payments that are due based on a simulated date.
 * @param {string} simulatedDate - The date to check for upcoming payments against.
 */
const UpcomingPayments = ({ simulatedDate }) => {
  // --- Context & State ---
  const { refetchData } = useContext(DataContext);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Effects ---
  // This effect fetches the list of due payments whenever the simulated date changes.
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
  }, [simulatedDate]);

  // --- Event Handlers ---
  const handleExecute = async (commitmentId) => {
    try {
      // The executionDate is the simulated date, to allow for historical processing.
      await axios.post(
        `http://localhost:3001/api/commitments/${commitmentId}/execute`,
        {
          executionDate: simulatedDate,
        }
      );
      // After executing, refetch all application data to see the new transaction.
      refetchData();
    } catch (err) {
      console.error("Failed to execute payment", err);
      alert("Failed to process payment.");
    }
  };

  // --- JSX Render ---
  if (loading) return <p>Checking for upcoming payments...</p>;
  if (upcoming.length === 0)
    return <p>No payments are due on or before the selected date.</p>;

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {upcoming.map((p) => (
            <tr key={p._id}>
              <td>{p.commitmentName}</td>
              <td className="amount expense">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(p.amount)}
              </td>
              <td>
                <button
                  onClick={() => handleExecute(p._id)}
                  className="execute-btn"
                >
                  Pay Now
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpcomingPayments;
