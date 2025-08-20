// client/src/components/FinancialInsights.jsx

import React from "react";
import "./FinancialInsights.css"; // We will create this next

const FinancialInsights = ({ summary }) => {
  const insights = [];

  // This is where the "advisor" logic lives.
  if (summary && summary.currentMonth && summary.previousMonth) {
    const current = summary.currentMonth;
    const previous = summary.previousMonth;

    // Insight 1: Compare total spending
    const totalCurrentSpending =
      current.totalExpense + current.totalSavings + current.totalInvestments;
    const totalPreviousSpending =
      previous.totalExpense + previous.totalSavings + previous.totalInvestments;
    if (totalCurrentSpending > totalPreviousSpending) {
      insights.push({
        type: "warning",
        text: `Your spending is up by $${(
          totalCurrentSpending - totalPreviousSpending
        ).toFixed(2)} compared to last month. Keep an eye on your budget.`,
      });
    } else if (totalCurrentSpending < totalPreviousSpending) {
      insights.push({
        type: "success",
        text: `Great job! You spent $${(
          totalPreviousSpending - totalCurrentSpending
        ).toFixed(2)} less than last month.`,
      });
    }

    // Insight 2: Savings check
    if (
      current.totalSavings > 0 &&
      current.totalSavings > previous.totalSavings
    ) {
      insights.push({
        type: "success",
        text: `Excellent! You've increased your savings by $${(
          current.totalSavings - previous.totalSavings
        ).toFixed(2)} this month.`,
      });
    }

    // Insight 3: Investment check
    if (current.totalInvestments > 0) {
      insights.push({
        type: "info",
        text: `You invested $${current.totalInvestments.toFixed(
          2
        )} this month. Consistent investing is key to long-term growth.`,
      });
    } else if (current.totalIncome > 3000) {
      insights.push({
        type: "suggestion",
        text: "You're not currently investing. Consider starting a small monthly investment (SIP) to grow your wealth.",
      });
    }

    // Insight 4: Surplus check
    const balance = current.totalIncome - totalCurrentSpending;
    if (balance > 500) {
      insights.push({
        type: "suggestion",
        text: `You have a surplus of $${balance.toFixed(
          2
        )}. This is a great opportunity to add to your savings or make an investment.`,
      });
    }
  }

  if (insights.length === 0) {
    return null; // Don't show the component if there's no advice to give
  }

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
