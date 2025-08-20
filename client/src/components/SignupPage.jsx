// client/src/components/SignupPage.jsx (CORRECTED)

import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // 1. Import the Link component
import "../Auth.css";

const SignupPage = () => {
  // 2. Remove the 'onSwitchToLogin' prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/signup",
        {
          email,
          password,
        }
      );

      console.log("Signup successful:", response.data);
      setSuccess("Account created successfully! Please login.");
    } catch (err) {
      console.error(
        "Signup error:",
        err.response ? err.response.data.message : err.message
      );
      setError(err.response ? err.response.data.message : "An error occurred.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p>Get started with your smart finance manager.</p>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <div className="input-group">
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button">
          Create Account
        </button>
        <p className="switch-form-text">
          Already have an account?{" "}
          {/* 3. Replace the span with a Link component */}
          <Link to="/login" className="switch-form-link">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
