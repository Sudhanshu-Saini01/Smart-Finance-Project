// // client/src/components/SignupPage.jsx
// // /----- VERSION V2 -----/

// import React, { useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import api from "@/utils/api";
// import "@/styles/Auth.css";

// const SignupPage = () => {
//   const [name, setName] = useState(""); // State for the name field
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false); // For button state

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError("");
//     setSuccess("");

//     try {
//       // Now sending the 'name' field to the backend
//       await axios.post("/users/signup", {
//         name,
//         email,
//         password,
//       });

//       setSuccess("Account created successfully! Please login.");
//     } catch (err) {
//       console.error(
//         "Signup error:",
//         err.response ? err.response.data.message : err.message
//       );
//       setError(err.response ? err.response.data.message : "An error occurred.");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <form className="auth-form" onSubmit={handleSubmit}>
//         <h2>Create Your Account</h2>
//         <p>Begin your journey to financial freedom.</p>
//         {error && <p className="error-message">{error}</p>}
//         {success && <p className="success-message">{success}</p>}

//         {/* Input Field for Name */}
//         <div className="input-group">
//           <label htmlFor="signup-name">Full Name</label>
//           <input
//             id="signup-name"
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//         </div>

//         <div className="input-group">
//           <label htmlFor="signup-email">Email</label>
//           <input
//             id="signup-email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div className="input-group">
//           <label htmlFor="signup-password">Password</label>
//           <input
//             id="signup-password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" className="auth-button" disabled={isSubmitting}>
//           {isSubmitting ? "Creating Account..." : "Create Account"}
//         </button>
//         <p className="switch-form-text">
//           Already have an account?{" "}
//           <Link to="/login" className="switch-form-link">
//             Login
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default SignupPage;
// // /----- END VERSION V2 -----/
// client/src/features/authentication/SignupPage.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "@/utils/api"; // --- FIX #1: Import our central API client ---
import "@/styles/auth.css"; // --- FIX #2: Ensure the CSS path is correct ---

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // For button state

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      // --- FIX #3: Use the 'api' client with a relative path ---
      await api.post("/users/signup", {
        name,
        email,
        password,
      });

      setSuccess("Account created successfully! Please login.");
    } catch (err) {
      setError(err.response ? err.response.data.message : "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Your Account</h2>
        <p>Begin your journey to financial freedom.</p>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

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
        <button type="submit" className="auth-button" disabled={isSubmitting}>
          {isSubmitting ? "Creating Account..." : "Create Account"}
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
