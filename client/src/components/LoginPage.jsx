// client/src/components/LoginPage.jsx (CORRECTED)

import React, { useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // 1. Import the Link component
import { AuthContext } from "../context/AuthContext";
import "../Auth.css";

const LoginPage = () => {
  // 2. Remove the 'onSwitchToSignup' prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3001/api/users/login",
        {
          email,
          password,
        }
      );
      login(response.data.token);
    } catch (err) {
      console.error(
        "Login error:",
        err.response ? err.response.data.message : err.message
      );
      setError(err.response ? err.response.data.message : "An error occurred.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <p>Welcome back!</p>
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button">
          Login
        </button>
        <p className="switch-form-text">
          Don't have an account?{" "}
          {/* 3. Replace the span with a Link component */}
          <Link to="/signup" className="switch-form-link">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
