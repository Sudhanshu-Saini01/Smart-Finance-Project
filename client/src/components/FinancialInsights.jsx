// client/src/components/FinancialInsights.jsx (LOCALIZED)

import React from "react";
import "./FinancialInsights.css";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

const FinancialInsights = ({ summary }) => {
  const insights = [];

  if (summary && summary.currentMonth && summary.previousMonth) {
    const current = summary.currentMonth;
    const previous = summary.previousMonth;

    const totalCurrentSpending = current.totalExpense;
    const totalPreviousSpending = previous.totalExpense;
    if (totalCurrentSpending > totalPreviousSpending) {
      insights.push({
        type: "warning",
        text: `Your spending is up by ${formatCurrency(
          totalCurrentSpending - totalPreviousSpending
        )} compared to last month. Review your expenses.`,
      });
    }

    if (current.totalSavings > 0) {
      insights.push({
        type: "success",
        text: `You've allocated ${formatCurrency(
          current.totalSavings
        )} to savings this month. Keep it up!`,
      });
    }

    if (current.totalInvestments > 0) {
      insights.push({
        type: "info",
        text: `You've allocated ${formatCurrency(
          current.totalInvestments
        )} for investments. Consider a monthly SIP for consistent growth.`,
      });
    } else if (current.totalIncome > 30000) {
      insights.push({
        type: "suggestion",
        text: "You're not currently investing. Explore options like Mutual Funds or PPF to grow your wealth.",
      });
    }

    const balance = current.totalIncome - totalCurrentSpending;
    if (balance > 5000) {
      insights.push({
        type: "suggestion",
        text: `You have a monthly surplus of ${formatCurrency(
          balance
        )}. This is a great opportunity to increase your savings or investments.`,
      });
    }
  }

  if (insights.length === 0) return null;

  return (
    <div className="insights-container">
      <h3>Advisor's Corner</h3>
      <ul>
        {insights.map((insight, index) => (
          <li key={index} className={`insight-item ${insight.type}`}>
            {insight.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FinancialInsights;
