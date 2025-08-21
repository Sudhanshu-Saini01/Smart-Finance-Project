// client/src/pages/GoalsPage.jsx

import React, { useContext } from "react";
import { DataContext } from "../context/DataContext";
import GoalCard from "../components/GoalCard"; // We will create this
import GoalForm from "../components/GoalForm"; // We will create this
import "./GoalsPage.css";

const GoalsPage = () => {
  const { goals, loading, error, refetchData } = useContext(DataContext);

  if (loading) {
    return <div className="loading-fullscreen">Loading Goals...</div>;
  }

  const totalSaved = goals.reduce((acc, goal) => acc + goal.currentAmount, 0);

  return (
    <div className="goals-page-container">
      <div className="goals-header">
        <h1>My Financial Goals</h1>
        <div className="total-saved-display">
          <span>Total Saved Across All Goals</span>
          <strong>
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(totalSaved)}
          </strong>
        </div>
      </div>

      <div className="goals-section">
        <h3>Create or Update a Goal</h3>
        <GoalForm onGoalAdded={refetchData} />
      </div>

      <div className="goals-section">
        <h3>Active Goals</h3>
        {error && <p className="error-message">{error}</p>}
        <div className="goals-grid">
          {goals.map((goal) => (
            <GoalCard key={goal._id} goal={goal} onFundAdded={refetchData} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
