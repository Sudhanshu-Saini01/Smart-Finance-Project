// client/src/features/dashboard/components/FinancialInsights.jsx

// --- Core Imports ---
import React from "react";
// --- Stylesheet Import ---
// Imports the specific styles for this component.
import "./FinancialInsights.css";

/**
 * @component FinancialInsights
 * @desc      Analyzes the user's financial summary to provide actionable advice and observations.
 * @param {object} { summary } - The user's monthly summary object, containing currentMonth and previousMonth data.
 */
const FinancialInsights = ({ summary }) => {
  // This array will store all the generated pieces of advice.
  const insights = [];

  // This is the core "advisor" logic. It only runs if we have data for both the current and previous months to compare.
  if (summary && summary.currentMonth && summary.previousMonth) {
    const current = summary.currentMonth;
    const previous = summary.previousMonth;

    // --- Insight 1: Compare Total Spending ---
    // It calculates total outgoings (expenses + savings + investments) for both months.
    const totalCurrentSpending =
      current.totalExpense + current.totalSavings + current.totalInvestments;
    const totalPreviousSpending =
      previous.totalExpense + previous.totalSavings + previous.totalInvestments;

    if (totalCurrentSpending > totalPreviousSpending) {
      // If spending increased, generate a "warning" insight.
      insights.push({
        type: "warning",
        text: `Your spending is up by ₹${(
          totalCurrentSpending - totalPreviousSpending
        ).toFixed(2)} compared to last month. Keep an eye on your budget.`,
      });
    } else if (totalCurrentSpending < totalPreviousSpending) {
      // If spending decreased, generate a "success" insight.
      insights.push({
        type: "success",
        text: `Great job! You spent ₹${(
          totalPreviousSpending - totalCurrentSpending
        ).toFixed(2)} less than last month.`,
      });
    }

    // --- Insight 2: Savings Check ---
    // If the user saved more this month than last month, generate a "success" insight.
    if (
      current.totalSavings > 0 &&
      current.totalSavings > previous.totalSavings
    ) {
      insights.push({
        type: "success",
        text: `Excellent! You've increased your savings by ₹${(
          current.totalSavings - previous.totalSavings
        ).toFixed(2)} this month.`,
      });
    }

    // --- Insight 3: Investment Check ---
    if (current.totalInvestments > 0) {
      // If the user invested money this month, provide an "info" insight.
      insights.push({
        type: "info",
        text: `You invested ₹${current.totalInvestments.toFixed(
          2
        )} this month. Consistent investing is key to long-term growth.`,
      });
    } else if (current.totalIncome > 3000) {
      // If they didn't invest but had a reasonable income, provide a "suggestion".
      insights.push({
        type: "suggestion",
        text: "You're not currently investing. Consider starting a small monthly investment (SIP) to grow your wealth.",
      });
    }

    // --- Insight 4: Surplus Check ---
    // It calculates if there was any money left over after all outgoings.
    const balance = current.totalIncome - totalCurrentSpending;
    if (balance > 500) {
      // If there's a significant surplus, generate a "suggestion" on how to use it.
      insights.push({
        type: "suggestion",
        text: `You have a surplus of ₹${balance.toFixed(
          2
        )}. This is a great opportunity to add to your savings or make an investment.`,
      });
    }
  }

  // --- Conditional Rendering ---
  // If no insights were generated (e.g., not enough data), the component will render nothing.
  // This prevents showing an empty "Advisor's Corner" on the dashboard.
  if (insights.length === 0) {
    return null;
  }

  // --- JSX to Render ---
  // If there are insights, display them in a list.
  return (
    <div className="insights-container">
      <h3>Advisor's Corner</h3>
      <ul>
        {/* We map over the insights array to create a list item for each piece of advice. */}
        {insights.map((insight, index) => (
          // The `key` is important for React's rendering performance.
          // The className is dynamic, using the `insight.type` (e.g., "warning", "success")
          // to apply different styles for each type of message.
          <li key={index} className={`insight-item ${insight.type}`}>
            {insight.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FinancialInsights;
