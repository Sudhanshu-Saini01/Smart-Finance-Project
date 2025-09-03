// client/src/features/profile/ProfilePage.jsx
import React, { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="profile-page-container">
      <header className="page-header">
        <h1>Profile & Settings</h1>
        <p>Manage your account details and security settings.</p>
      </header>

      <div className="profile-section">
        <h3>Your Information</h3>
        <div className="info-group">
          <label>Full Name</label>
          <p>{user?.name}</p>
        </div>
        <div className="info-group">
          <label>Email Address</label>
          <p>{user?.email}</p>
        </div>
      </div>

      <div className="profile-section">
        <h3>Security</h3>
        <div className="info-group">
          <label>Password</label>
          <p>••••••••</p>
        </div>
        <button className="change-password-btn">Change Password</button>
      </div>
    </div>
  );
};

export default ProfilePage;
