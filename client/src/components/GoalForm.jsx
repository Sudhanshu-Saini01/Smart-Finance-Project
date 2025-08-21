// client/src/components/GoalForm.jsx
// /----- VERSION V2 -----/

import React, { useState } from "react";
import axios from "axios";
import "./GoalForm.css";

const GoalForm = ({ onGoalAdded }) => {
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [goalType, setGoalType] = useState("item");
  const [imageUrl, setImageUrl] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!goalName || !targetAmount) {
      setError("Please provide a name and target amount.");
      return;
    }
    try {
      await axios.post("http://localhost:3001/api/goals", {
        goalName,
        targetAmount: parseFloat(targetAmount),
        goalType,
        imageUrl,
        priority,
      });
      onGoalAdded();
      setGoalName("");
      setTargetAmount("");
      setGoalType("item");
      setImageUrl("");
      setPriority("medium");
    } catch (err) {
      setError("Failed to create goal.", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="goal-form">
      {error && <p className="error-message full-width">{error}</p>}
      <div className="form-row">
        <div className="form-group">
          <label>What is your goal?</label>
          <input
            type="text"
            placeholder="e.g., New Car, Child's Education"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Target Amount (₹)</label>
          <input
            type="number"
            placeholder="5,00,000"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Goal Type</label>
          <select
            value={goalType}
            onChange={(e) => setGoalType(e.target.value)}
          >
            <option value="item">Physical Item (Car, House)</option>
            <option value="event">Financial Event (Marriage, Education)</option>
          </select>
        </div>
        <div className="form-group">
          <label>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        {goalType === "item" && (
          <div className="form-group full-width">
            <label>Image URL (Optional)</label>
            <input
              type="text"
              placeholder="https://example.com/image.png"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        )}
      </div>
      <button type="submit" className="submit-btn full-width">
        Create New Goal
      </button>
    </form>
  );
};

export default GoalForm;
// /----- END VERSION V2 -----/
