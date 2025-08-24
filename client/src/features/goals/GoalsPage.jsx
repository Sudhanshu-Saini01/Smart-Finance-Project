// client/src/pages/GoalsPage.jsx

import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DataContext } from "@/context/DataContext";
import UniversalForm from "@/features/transactions/components/UniversalForm/UniversalForm";
import GoalCard from "@/features/goals/components/GoalCard";
import LinkCommitmentModal from "@/features/goals/components/LinkCommitmentModal";
// ===================================================================
// == UPDATE: 2025-08-24 | Replace Prompt with Modal ==
// We now import our new choice modal.
import FundingChoiceModal from "@/features/goals/components/FundingChoiceModal";
// ===================================================================
import "./GoalsPage.css";

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
    defaultValue: "item",
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
  const navigate = useNavigate();

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [goalToLink, setGoalToLink] = useState(null);
  // ===================================================================
  // == UPDATE: 2025-08-24 | Replace Prompt with Modal ==
  // New state to manage our new funding choice modal.
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const [newlyCreatedGoal, setNewlyCreatedGoal] = useState(null);
  // ===================================================================

  const handleCreateGoal = async (formData) => {
    try {
      const goalData = {
        ...formData,
        imageUrl:
          formData.imageUrl ||
          "https://placehold.co/600x400/6c757d/FFF?text=My+Goal",
      };
      const res = await axios.post("http://localhost:3001/api/goals", goalData);
      const newGoal = res.data;
      await refetchData();

      // ===================================================================
      // == UPDATE: 2025-08-24 | Replace Prompt with Modal ==
      // Instead of a prompt, we now set the state to open our new choice modal.
      setNewlyCreatedGoal(newGoal);
      setIsChoiceModalOpen(true);
      // ===================================================================
    } catch (err) {
      console.error("Failed to create goal", err);
      alert("Failed to create goal.");
    }
  };

  // ===================================================================
  // == UPDATE: 2025-08-24 | Replace Prompt with Modal ==
  // These are the new handler functions for the choice modal's buttons.
  const handleChooseLink = () => {
    setGoalToLink(newlyCreatedGoal);
    setIsChoiceModalOpen(false);
    setIsLinkModalOpen(true);
  };

  const handleChooseNew = () => {
    navigate(
      `/investments?goalId=${
        newlyCreatedGoal._id
      }&goalName=${encodeURIComponent(newlyCreatedGoal.goalName)}`
    );
    setIsChoiceModalOpen(false);
  };
  // ===================================================================

  if (loading) {
    return <div className="loading-fullscreen">Loading Goals...</div>;
  }

  const totalSaved = goals.reduce((acc, goal) => acc + goal.currentAmount, 0);

  return (
    <>
      {/* This is the modal for linking an existing commitment. */}
      <LinkCommitmentModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        goal={goalToLink}
      />

      {/* =================================================================== */}
      {/* == UPDATE: 2025-08-24 | Replace Prompt with Modal == */}
      {/* This is our new modal that asks the user how to fund the goal. */}
      <FundingChoiceModal
        isOpen={isChoiceModalOpen}
        onClose={() => setIsChoiceModalOpen(false)}
        onLink={handleChooseLink}
        onNew={handleChooseNew}
        goal={newlyCreatedGoal}
      />
      {/* =================================================================== */}

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
              goals.map((goal) => <GoalCard key={goal._id} goal={goal} />)
            ) : (
              <div className="empty-state">
                <p>You haven't set any goals yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GoalsPage;
