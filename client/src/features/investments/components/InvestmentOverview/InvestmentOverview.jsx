// client/src/features/investments/components/InvestmentOverview/InvestmentOverview.jsx
import React from "react";
import "./InvestmentOverview.css";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    amount
  );

const InvestmentOverview = ({ totalInvested, currentValue }) => {
  const gainLoss = currentValue - totalInvested;
  const gainLossPercent =
    totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;
  const isProfit = gainLoss >= 0;

  return (
    <div className="overview-grid">
      <div className="stat-card">
        <span className="stat-label">Total Invested</span>
        <strong className="stat-value">{formatCurrency(totalInvested)}</strong>
      </div>
      <div className="stat-card">
        <span className="stat-label">Current Value</span>
        <strong className="stat-value">{formatCurrency(currentValue)}</strong>
      </div>
      <div className={`stat-card ${isProfit ? "profit" : "loss"}`}>
        <span className="stat-label">Overall Gain/Loss</span>
        <strong className="stat-value">
          {isProfit ? "+" : ""}
          {formatCurrency(gainLoss)}
        </strong>
        <span className="stat-percent">({gainLossPercent.toFixed(2)}%)</span>
      </div>
    </div>
  );
};

export default InvestmentOverview;
