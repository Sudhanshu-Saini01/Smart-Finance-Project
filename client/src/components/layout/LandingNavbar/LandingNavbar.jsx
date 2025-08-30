// // client/src/components/layout/LandingNavbar/LandingNavbar.jsx
// import React from "react";
// import { Link } from "react-router-dom";
// import "./LandingNavbar.css";

// const LandingNavbar = () => {
//   return (
//     <nav className="landing-navbar">
//       <div className="nav-container">
//         <Link to="/" className="nav-logo">
//           WellPay
//         </Link>
//         <div className="nav-links">
//           <a href="/">Home</a>
//           <a href="#features">Features</a>
//           <a href="#pricing">Pricing</a>
//           <a href="#about">About Us</a>
//         </div>
//         <div className="nav-actions">
//           <Link to="/login" className="nav-login-btn">
//             Login
//           </Link>
//           <Link to="/signup" className="nav-signup-btn">
//             Sign Up
//           </Link>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default LandingNavbar;

// client/src/components/layout/LandingNavbar/LandingNavbar.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./LandingNavbar.css";

const LandingNavbar = () => {
  // State to track if the mobile menu is open
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State to track if the page has been scrolled
  const [isScrolled, setIsScrolled] = useState(false);

  // Effect to add a scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      // Set isScrolled to true if user has scrolled more than 10px, otherwise false
      setIsScrolled(window.scrollY > 10);
    };

    // Add the listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Clean up the listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // The empty array ensures this effect runs only once

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    // The navbar's class will now be dynamic based on scroll and menu state
    <nav
      className={`landing-navbar ${isScrolled ? "scrolled" : ""} ${
        isMenuOpen ? "menu-open" : ""
      }`}
    >
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          WellPay
        </Link>

        {/* This div now wraps all menu items and becomes the mobile menu */}
        <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <div className="nav-links">
            <a href="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </a>
            <a href="#features" onClick={() => setIsMenuOpen(false)}>
              Features
            </a>
            <a href="#pricing" onClick={() => setIsMenuOpen(false)}>
              Pricing
            </a>
          </div>
          <div className="nav-actions">
            <Link to="/login" className="nav-login-btn">
              Login
            </Link>
            <Link to="/signup" className="nav-signup-btn">
              Sign Up
            </Link>
          </div>
        </div>

        {/* --- Hamburger Menu Button --- */}
        <button
          className="hamburger-menu"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </button>
      </div>
    </nav>
  );
};

export default LandingNavbar;
