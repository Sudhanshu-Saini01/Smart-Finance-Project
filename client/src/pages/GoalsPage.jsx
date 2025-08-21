// client/src/pages/GoalsPage.jsx
// /----- VERSION V2 -----/

import React, { useContext } from "react";
import { DataContext } from "../context/DataContext";
import GoalCard from "../components/GoalCard.jsx";
import GoalForm from "../components/GoalForm.jsx";
import "./GoalsPage.css";

const GoalsPage = () => {
  const { goals, loading, error, refetchData } = useContext(DataContext);

  if (loading) {
    return <div className="loading-fullscreen">Loading Goals...</div>;
  }

  // Calculate the total amount saved across all active goals
  const totalSaved = goals.reduce((acc, goal) => acc + goal.currentAmount, 0);

  return (
    <div className="goals-page-container">
      <div className="goals-header">
        <h1>My Financial Goals</h1>
        <div className="total-saved-display">
          <span>Total Contributed to Goals</span>
          <strong>
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(totalSaved)}
          </strong>
        </div>
      </div>

      <div className="goals-section">
        <h3>Create a New Goal</h3>
        <GoalForm onGoalAdded={refetchData} />
      </div>

      <div className="goals-section">
        <h3>Your Active Goals</h3>
        {error && <p className="error-message">{error}</p>}
        <div className="goals-grid">
          {goals && goals.length > 0 ? (
            goals.map((goal) => (
              <GoalCard key={goal._id} goal={goal} onFundAdded={refetchData} />
            ))
          ) : (
            <div className="empty-state">
              <p>
                You haven't set any goals yet. Create one above to start your
                financial journey!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
