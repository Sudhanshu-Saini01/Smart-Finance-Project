// client/src/features/landing/LandingPage.jsx

import React, { useState } from "react"; // Import useState
import { Link } from "react-router-dom";
import "./LandingPage.css";
import Modal from "@/components/ui/Modal/Modal";
// --- NEW: Import our clean, extracted component ---
import AddFormDemo from "./components/AddFormDemo";

// --- NEW: Import images like modules ---
import dashboardImage from "@/assets/dashboard.jpg";
import transactionImage from "@/assets/transaction.png";
import investmentImage from "@/assets/investment.png";
import insuranceImage from "@/assets/insurance.jpg";

// --- Sample Data for the Demo ---
const sampleTransaction = {
  date: "2025-08-28T10:00:00.000Z",
  description: "Swiggy Order",
  category: "Food",
  type: "expense",
  amount: 450.75,
};

const LandingPage = () => {
  // --- State to control the modal's visibility ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setFormModalOpen] = useState(false);

  return (
    <div className="landing-page">
      {/* Section 1: Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Take Control of Your Financial Future</h1>
          <p>
            WellPay helps you track, manage, and grow your money with
            confidence. All your finances, one simple platform.
          </p>
          <Link to="/signup" className="cta-button">
            Get Started for Free
          </Link>
        </div>
      </header>

      {/* --- EXPANDED FEATURES SHOWCASE --- */}
      <main className="features-section">
        {/* Feature: The Dashboard */}
        <div className="feature-item">
          <div className="feature-text">
            <h2>Your Entire Financial Life, Instantly Clear</h2>
            <p>
              Our intuitive dashboard brings together your income, expenses,
              savings, and investments. See your real-time financial health at a
              glance and make smarter decisions instantly.
            </p>
            <Link to="/features/dashboard" className="know-more-link">
              Know More →
            </Link>
          </div>
          <div className="feature-image">
            <img
              //   src="https://placehold.co/600x400/6a82fb/ffffff?text=Unified+Dashboard"
              // src="src/assets/dashboard.jpg"
              src={dashboardImage}
              alt="Dashboard Preview"
            />
          </div>
        </div>

        {/* Feature: Spending & Transactions */}
        <div className="feature-item reverse">
          <div className="feature-text">
            <h2>Understand Every Rupee</h2>
            <p>
              Say goodbye to confusing spreadsheets. Automatically track and
              categorize all your transactions, separating fixed bills from
              variable day-to-day spending. Know exactly where your money goes.
            </p>
            <Link to="/features/spending" className="know-more-link">
              Know More →
            </Link>
          </div>
          <div className="feature-image">
            <img
              //   src="https://placehold.co/600x400/4c68d7/ffffff?text=Track+Spending"
              // src="src/assets/transaction.png"
              src={transactionImage}
              alt="Track Spending Preview"
            />
          </div>
        </div>

        {/* Feature: Income, Savings & Investments */}
        <div className="feature-item">
          <div className="feature-text">
            <h2>From Income to Investment, Seamlessly</h2>
            <p>
              Track all your income sources, create dedicated savings buckets,
              and watch your investments grow. We provide the tools you need to
              build wealth, one step at a time.
            </p>
            <Link to="/features/growth" className="know-more-link">
              Know More →
            </Link>
          </div>
          <div className="feature-image">
            <img
              //   src="https://placehold.co/600x400/6a82fb/ffffff?text=Grow+Your+Wealth"
              // src="src/assets/investment.png"
              src={investmentImage}
              alt="Grow Wealth Preview"
            />
          </div>
        </div>

        {/* Feature: Loans & Insurance */}
        <div className="feature-item reverse">
          <div className="feature-text">
            <h2>Manage Liabilities with Confidence</h2>
            <p>
              Keep track of loan payments and insurance premiums all in one
              place. Never miss a due date and get a clear picture of your debts
              and financial safety net.
            </p>
            <Link to="/features/liabilities" className="know-more-link">
              Know More →
            </Link>
          </div>
          <div className="feature-image">
            <img
              //   src="https://placehold.co/600x400/4c68d7/ffffff?text=Manage+Liabilities"
              // src="src/assets/insurance.jpg"
              src={insuranceImage}
              alt="Manage Liabilities Preview"
            />
          </div>
        </div>
      </main>
      {/* --- END OF FEATURES SHOWCASE --- */}

      {/* --- NEW: Final Call to Action Section --- */}
      <section className="final-cta-section">
        <h2>Ready to Build a Brighter Financial Future?</h2>
        <p>
          Join thousands of users who are simplifying their finances and
          achieving their dreams.
        </p>
        <Link to="/signup" className="cta-button">
          Sign Up Now - It's Free!
        </Link>
      </section>
      {/* --- END OF NEW SECTION --- */}

      {/* --- NEW: Demo Button for adding form --- */}
      <button
        className="demo-button add-form"
        onClick={() => setFormModalOpen(true)}
      >
        Preview Add Form
      </button>

      {/* --- NEW: Demo Button --- */}
      <button
        className="demo-popup-button"
        onClick={() => setIsModalOpen(true)}
      >
        Preview Transaction
      </button>

      {/* --- Modal for Add Form --- */}
      <Modal isOpen={isFormModalOpen} onClose={() => setFormModalOpen(false)}>
        <AddFormDemo />
      </Modal>

      {/* --- NEW ADVANCED MODAL CONTENT --- */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="adv-transaction-view">
          <div className="adv-header">
            <div className="adv-icon-wrapper">
              {/* Icon for Food & Dining */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22a10 10 0 0 0 10-10H2a10 10 0 0 0 10 10Z" />
                <path d="M7 12a5 5 0 0 1 10 0" />
                <path d="M12 2v2" />
                <path d="M17 4.22a9 9 0 0 0-10 0" />
              </svg>
            </div>
            <div className="adv-title">
              <h2>{sampleTransaction.description}</h2>
              <p>{sampleTransaction.category}</p>
            </div>
            <div className="adv-amount expense">
              -{" "}
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(sampleTransaction.amount)}
            </div>
          </div>
          <div className="adv-body">
            <div className="adv-detail-item">
              <span>Transaction Date</span>
              <strong>
                {new Date(sampleTransaction.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </strong>
            </div>
            <div className="adv-detail-item">
              <span>Transaction Type</span>
              <strong className={`type-pill ${sampleTransaction.type}`}>
                {sampleTransaction.type}
              </strong>
            </div>
          </div>
        </div>
      </Modal>
      {/* --- END OF NEW ADVANCED MODAL CONTENT --- */}
    </div>
  );
};

export default LandingPage;
