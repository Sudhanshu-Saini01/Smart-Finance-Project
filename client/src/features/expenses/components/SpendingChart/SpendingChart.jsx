// client/src/features/expenses/components/SpendingChart/SpendingChart.jsx
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import "./SpendingChart.css";

const SpendingChart = ({ transactions }) => {
  const chartData = useMemo(() => {
    const expenseByCategory = transactions
      .filter((tx) => tx.type === "expense")
      .reduce((acc, tx) => {
        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
        return acc;
      }, {});

    return Object.entries(expenseByCategory)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const COLORS = ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"];

  return (
    <div className="chart-container">
      <h3>Spending by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            axisLine={false}
            tickLine={false}
            width={100}
          />
          <Tooltip
            cursor={{ fill: "#f4f7ff" }}
            formatter={(value) => new Intl.NumberFormat("en-IN").format(value)}
          />
          <Bar dataKey="amount" barSize={25} radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default SpendingChart;
