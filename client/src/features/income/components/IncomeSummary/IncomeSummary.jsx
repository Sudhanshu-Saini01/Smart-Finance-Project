// client/src/features/income/components/IncomeSummary/IncomeSummary.jsx
import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import "./IncomeSummary.css";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    amount
  );

const IncomeSummary = ({ incomeSources }) => {
  const { totalNetIncome, chartData } = useMemo(() => {
    const totalNetIncome = incomeSources.reduce(
      (acc, source) => acc + source.netAmount,
      0
    );
    const chartData = incomeSources.map((source) => ({
      name: source.sourceName,
      value: source.netAmount,
    }));
    return { totalNetIncome, chartData };
  }, [incomeSources]);

  const COLORS = ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc"];

  return (
    <div className="income-summary-container">
      <div className="total-income-card">
        <span className="stat-label">Total Net Monthly Income</span>
        <strong className="stat-value">{formatCurrency(totalNetIncome)}</strong>
      </div>
      <div className="income-chart-card">
        <h4>Income Mix</h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default IncomeSummary;
