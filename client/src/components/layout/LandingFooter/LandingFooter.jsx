// client/src/components/layout/LandingFooter/LandingFooter.jsx
import React from "react";
import "./LandingFooter.css";

const LandingFooter = () => {
  return (
    <footer className="landing-footer">
      <div className="footer-container">
        <div className="footer-column">
          <h4>WellPay</h4>
          <p>Your financial command center. Take control, build wealth.</p>
        </div>
        <div className="footer-column">
          <h5>Product</h5>
          <a href="/features/dashboard">Dashboard</a>
          <a href="/features/spending">Transactions</a>
          <a href="/features/growth">Growth</a>
        </div>
        <div className="footer-column">
          <h5>Company</h5>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
          <a href="#careers">Careers</a>
        </div>
        <div className="footer-column">
          <h5>Legal</h5>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 WellPay. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default LandingFooter;
