// client/src/features/feature-details/FeatureDetailPage.jsx

import React from "react";
import { useParams, Link } from "react-router-dom";
import "./FeatureDetailPage.css";

// --- NEW: Import images like modules ---
import dashboardImage from "@/assets/dashboard.jpg";
import transactionImage from "@/assets/transaction.png";
import investmentImage from "@/assets/investment.png";
import insuranceImage from "@/assets/insurance.jpg";

// In a real app, this content would come from a database or a content file.
// For now, we'll hardcode it for our "Dashboard" example.
const featureContent = {
  dashboard: {
    title: "The Dashboard: Your Financial Command Center",
    subtitle:
      "Get a complete, real-time overview of your financial health in one simple, intuitive view.",
    highlights: [
      "Real-time Balances",
      "Income vs. Expense Charts",
      "Upcoming Bill Reminders",
    ],
    imageUrl:
      //   "https://placehold.co/800x450/6a82fb/ffffff?text=Dashboard+Screenshot",
      // "../src/assets/dashboard.jpg",
      { dashboardImage },
    description:
      "The dashboard is the heart of WellPay. It's the first thing you see when you log in, designed to give you instant clarity. Track your net worth, see your spending trends, and check on your goal progress without ever having to dig through menus. We bring the most important information to the forefront so you can make smarter financial decisions, faster.",
    // --- NEW: Detailed breakdown of key features ---
    keyFeatures: [
      {
        icon: "📊",
        title: "Income vs. Expense",
        text: "Instantly see your cash flow for the month with a clear, visual chart. Know if you're in the green or red at a glance.",
      },
      {
        icon: "🎯",
        title: "Goal Progress Tracking",
        text: "Keep your eyes on the prize. See how close you are to achieving your financial goals, from saving for a vacation to a down payment.",
      },
      {
        icon: "🔔",
        title: "Upcoming Bill Reminders",
        text: "Never miss a payment again. The dashboard intelligently shows you which bills and recurrings are due soon.",
      },
      {
        icon: "💡",
        title: "Financial Insights",
        text: "Our smart advisor analyzes your spending and provides actionable tips to help you save more and spend smarter.",
      },
    ],
    // We can add content for 'spending', 'growth', etc. here later.
  },

  // We can add content for 'spending', 'growth', etc. here later.
  // --- NEW: Content for the Spending Feature Page ---
  spending: {
    title: "Transactions: Understand Every Rupee",
    subtitle:
      "Gain complete clarity on your spending habits with powerful, automated transaction tracking and categorization.",
    imageUrl:
      //   "https://placehold.co/800x450/4c68d7/ffffff?text=Transaction+History",
      // "../src/assets/transaction.png",
      { transactionImage },
    description:
      "Stop wondering where your money went. WellPay connects to your accounts to automatically import and categorize every transaction. Search, filter, and analyze your history to identify spending patterns, find areas to save, and take full control of your outgoings.",
    keyFeatures: [
      {
        icon: "🤖",
        title: "Automatic Categorization",
        text: "Our smart system automatically assigns categories like 'Groceries', 'Transport', and 'Utilities' to your spending.",
      },
      {
        icon: " แยก",
        title: "Fixed vs. Variable",
        text: "Clearly see the difference between your essential fixed bills (rent, EMIs) and your flexible, day-to-day variable spending.",
      },
      {
        icon: "🔍",
        title: "Powerful Search & Filters",
        text: "Instantly find any transaction. Search by name, category, or date range to get the answers you need in seconds.",
      },
      {
        icon: "📈",
        title: "Spending Trends",
        text: "Visualize your spending over time to understand your habits, see the impact of your budget, and make informed choices.",
      },
    ],
  },
  // We can add content for 'growth', etc. here later.
  growth: {
    title: "From Income to Investment, Seamlessly",
    subtitle:
      "Actively grow your wealth with integrated tools for tracking income, managing savings, and monitoring investments.",
    highlights: [],
    imageUrl:
      //   "https://placehold.co/800x450/6a82fb/ffffff?text=Grow+Your+Wealth",
      // "../src/assets/investment.png",
      { investmentImage },
    description:
      "WellPay helps you build a strong financial foundation. Track every income source, create dedicated savings goals for things like vacations or emergencies, and keep a close eye on your investment portfolio's performance, all in one place.",
    keyFeatures: [
      {
        icon: "💼",
        title: "Multiple Income Sources",
        text: "Whether it's a salary, freelance work, or side hustles, track all your income streams to get a true picture of your earnings.",
      },
      {
        icon: "🏦",
        title: "Dedicated Savings Goals",
        text: "Create specific 'buckets' for your savings. Visually track your progress towards each goal and stay motivated.",
      },
      {
        icon: "💹",
        title: "Investment Monitoring",
        text: "Connect your investment accounts to monitor your portfolio's value and performance over time.",
      },
      {
        icon: "🌱",
        title: "Build Your Net Worth",
        text: "By combining income, savings, and investments, you can get a clear, real-time calculation of your growing net worth.",
      },
    ],
  },

  // --- NEW: Content for the Liabilities Feature Page ---
  liabilities: {
    title: "Manage Liabilities with Confidence",
    subtitle:
      "Get a clear, consolidated view of your loans and insurance. Never miss a payment and stay on top of your financial obligations.",
    highlights: [],
    imageUrl:
      //   "https://placehold.co/800x450/4c68d7/ffffff?text=Manage+Liabilities",
      // "../src/assets/insurance.jpg",
      { insuranceImage },
    description:
      "A healthy financial life isn't just about assets; it's also about managing your responsibilities. WellPay provides a centralized hub to track all your loans and insurance policies, giving you peace of mind.",
    keyFeatures: [
      {
        icon: "💳",
        title: "Loan & EMI Tracking",
        text: "Monitor all your loans in one dashboard, from personal and home loans to credit card debt. Know your outstanding balances and due dates.",
      },
      {
        icon: "🛡️",
        title: "Insurance Premium Hub",
        text: "Keep track of all your crucial insurance policies—health, life, auto—and never be surprised by a premium payment again.",
      },
      {
        icon: "🗓️",
        title: "Payment Due Alerts",
        text: "Receive timely reminders for upcoming loan EMIs and insurance premiums so you can avoid late fees and maintain a healthy credit score.",
      },
      {
        icon: "📉",
        title: "Debt Reduction View",
        text: "Visualize your total debt and track your progress as you work towards paying it down. Stay motivated on your journey to becoming debt-free.",
      },
    ],
  },
};

const FeatureDetailPage = () => {
  const { featureName } = useParams();

  // Get the content for the current feature, or default to a generic message.
  const content = featureContent[featureName];
  //   const content = featureContent[featureName] || {
  //     title: `${
  //       featureName.charAt(0).toUpperCase() + featureName.slice(1)
  //     } Feature`,
  //     subtitle: "More details about this exciting feature are coming soon!",
  //     highlights: [],
  //     imageUrl: "https://placehold.co/800x450/cccccc/ffffff?text=Coming+Soon",
  //     description: "This is where a detailed explanation will go.",
  //     keyFeatures: [],
  //   };

  // A safety net in case a link points to a feature that doesn't exist at all
  if (!content) {
    return (
      <div className="feature-detail-page">
        <h1>Feature Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="feature-detail-page">
      <header className="feature-hero">
        <h1>{content.title}</h1>
        <p className="feature-subtitle">{content.subtitle}</p>
      </header>

      {content.highlights && content.highlights.length > 0 && (
        <div className="feature-highlights">
          {content.highlights.map((highlight, index) => (
            <div key={index} className="highlight-card">
              <span>{highlight}</span>
            </div>
          ))}
        </div>
      )}

      <div className="feature-visual">
        <img src={content.imageUrl} alt={`${content.title} preview`} />
      </div>

      {/* --- NEW: Key Features Grid Section --- */}
      {content.keyFeatures.length > 0 && (
        <div className="key-features-section">
          <h2>Key Features</h2>
          <div className="key-features-grid">
            {content.keyFeatures.map((feature, index) => (
              <div key={index} className="key-feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* --- END OF NEW SECTION --- */}

      <div className="feature-description">
        <h2>How It Helps You</h2>
        <p>{content.description}</p>
      </div>

      <Link to="/signup" className="cta-button-feature">
        Start for Free
      </Link>
      <Link to="/" className="back-link">
        ← Back to Home
      </Link>
    </div>
  );
};

export default FeatureDetailPage;
