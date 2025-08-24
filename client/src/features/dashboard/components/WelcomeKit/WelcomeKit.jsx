// client/src/components/WelcomeKit.jsx
// /----- VERSION V2 -----/

import React from "react";
import { Link } from "react-router-dom";
import "./WelcomeKit.css";

const WelcomeKit = ({ user }) => {
  return (
    <div className="welcome-kit-container">
      <div className="welcome-kit-content">
        <h1>Welcome to SmartFinance, {user?.name}!</h1>
        <p>
          You're just a few steps away from taking full control of your
          financial future. Let's get started.
        </p>
        <div className="welcome-kit-actions">
          <Link to="/transactions" className="welcome-kit-button primary">
            + Add Your First Income
          </Link>
          <Link to="/goals" className="welcome-kit-button secondary">
            🎯 Set Your First Goal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeKit;
