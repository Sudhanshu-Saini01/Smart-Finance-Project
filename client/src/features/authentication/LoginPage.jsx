// client/src/features/authentication/LoginPage.jsx

import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import api from "@/utils/api"; // --- FIX #1: Import our central API client ---
import "@/styles/Auth.css"; // --- FIX #2: Ensure the CSS path is correct ---

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // --- FIX #3: Use the 'api' client with a relative path ---
      const response = await api.post("/users/login", {
        email,
        password,
      });
      // The login function from AuthContext will handle the token and navigation
      login(response.data.token);
    } catch (err) {
      setError(err.response ? err.response.data.message : "An error occurred.");
      // On error, set loading state back to false so the user can try again
      setIsSubmitting(false);
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
            disabled={isSubmitting} // Disable input when submitting
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
            disabled={isSubmitting} // Disable input when submitting
          />
        </div>
        <button type="submit" className="auth-button" disabled={isSubmitting}>
          {isSubmitting ? "Logging In..." : "Login"}
        </button>
        <p className="switch-form-text">
          Don't have an account?{" "}
          <Link to="/signup" className="switch-form-link">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
