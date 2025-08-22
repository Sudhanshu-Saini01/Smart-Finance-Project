// client/src/pages/GoalsPage.jsx
//-------- Start: Version V3.0.0---------//

import React, { useContext } from "react";
import axios from "axios";
import { DataContext } from "../context/DataContext";
import InfoCard from "../components/InfoCard";
import UniversalForm from "../components/UniversalForm";
import ContributeFundsForm from "../components/ContributeFundsForm";
import "./GoalsPage.css";

// The "checklist" for creating a new goal
const goalFormConfig = [
  {
    name: "goalName",
    label: "Goal Name",
    placeholder: "e.g., Down payment for a Car",
    required: true,
  },
  {
    name: "targetAmount",
    label: "Target Amount (₹)",
    type: "number",
    placeholder: "5,00,000",
    required: true,
  },
  {
    name: "goalType",
    label: "Goal Type",
    type: "select",
    options: [
      { value: "item", label: "Physical Item (Car, House)" },
      { value: "event", label: "Financial Event (Marriage, Education)" },
    ],
  },
  {
    name: "priority",
    label: "Priority",
    type: "select",
    defaultValue: "medium",
    options: [
      { value: "high", label: "High" },
      { value: "medium", label: "Medium" },
      { value: "low", label: "Low" },
    ],
  },
  {
    name: "imageUrl",
    label: "Image URL (Optional)",
    placeholder: "https://example.com/image.png",
  },
];

const GoalsPage = () => {
  const { goals, loading, error, refetchData } = useContext(DataContext);

  const handleCreateGoal = async (formData) => {
    try {
      await axios.post("http://localhost:3001/api/goals", formData);
      refetchData();
    } catch (err) {
      console.error("Failed to create goal", err);
      alert("Failed to create goal.");
    }
  };

  if (loading) {
    return <div className="loading-fullscreen">Loading Goals...</div>;
  }

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
        <UniversalForm
          title="Create a New Goal"
          config={goalFormConfig}
          onSubmit={handleCreateGoal}
          submitText="Create Goal"
        />
      </div>

      <div className="goals-section">
        <h3>Your Active Goals</h3>
        {error && <p className="error-message">{error}</p>}
        <div className="goals-grid">
          {goals && goals.length > 0 ? (
            goals.map((goal) => (
              <InfoCard
                key={goal._id}
                image={goal.imageUrl}
                title={goal.goalName}
                primaryStats={[
                  {
                    label: "Saved",
                    value: new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(goal.currentAmount),
                  },
                  {
                    label: "Target",
                    value: new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(goal.targetAmount),
                  },
                ]}
                progress={(goal.currentAmount / goal.targetAmount) * 100}
              >
                <ContributeFundsForm
                  goalId={goal._id}
                  onFundAdded={refetchData}
                />
              </InfoCard>
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
//-------- End: Version V3.0.0---------//
