// client/src/components/SignupPage.jsx
// /----- VERSION V2 -----/

import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Auth.css";

const SignupPage = () => {
  const [name, setName] = useState(""); // State for the name field
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Now sending the 'name' field to the backend
      await axios.post("http://localhost:3001/api/users/signup", {
        name,
        email,
        password,
      });

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
        <h2>Create Your Account</h2>
        <p>Begin your journey to financial freedom.</p>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        {/* Input Field for Name */}
        <div className="input-group">
          <label htmlFor="signup-name">Full Name</label>
          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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
          <Link to="/login" className="switch-form-link">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
// /----- END VERSION V2 -----/
