// client/src/features/admin/AdminPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "@/context/DataContext";
import { NotificationContext } from "@/context/NotificationContext";
import api from "@/utils/api";
import "./AdminPage.css";

const AdminPage = () => {
  const { addNotification } = useContext(NotificationContext);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [sourceName, setSourceName] = useState("Monthly Salary");
  const [amount, setAmount] = useState("50000");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all users to populate the dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users"); // We will create this route next
        setUsers(res.data);
      } catch (err) {
        addNotification("Could not fetch users", err);
      }
    };
    fetchUsers();
  }, [addNotification]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      return addNotification("Please select a user.", "error");
    }
    setIsSubmitting(true);
    try {
      await api.post("/admin/simulate-deposit", {
        userId: selectedUserId,
        sourceName,
        amount,
      });
      addNotification("Deposit simulated successfully!", "success");
      setSelectedUserId(""); // Reset form
    } catch (err) {
      const msg = err.response?.data?.message || "An error occurred.";
      addNotification(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-page-container">
      <header className="page-header">
        <h1>Admin Panel</h1>
        <p>Tools for managing the application and testing.</p>
      </header>
      <section className="admin-section">
        <h3>Simulate a Bank Deposit</h3>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="user-select">Select User</label>
            <select
              id="user-select"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">-- Choose a user --</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="sourceName">Source / Description</label>
            <input
              type="text"
              id="sourceName"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="form-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Simulating..." : "Simulate Deposit"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AdminPage;
