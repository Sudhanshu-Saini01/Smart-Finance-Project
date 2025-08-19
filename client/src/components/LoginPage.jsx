// client/src/components/LoginPage.jsx (UPDATE THIS FILE)

import React, { useState, useContext } from "react"; // Import useContext
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import "../Auth.css";

const LoginPage = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Get the login function from our context
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

      // Use the login function from context to save the token
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
          <span onClick={onSwitchToSignup} className="switch-form-link">
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
