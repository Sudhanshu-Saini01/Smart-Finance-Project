// client/src/components/SignupPage.jsx

import React, { useState } from "react";
import axios from "axios"; // Import axios
import "../Auth.css";

const SignupPage = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // To show a success message

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
          <span onClick={onSwitchToLogin} className="switch-form-link">
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
