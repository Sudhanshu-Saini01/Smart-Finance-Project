// client/src/components/SummaryChart.jsx

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SummaryChart = ({ data }) => {
  if (!data) return null;

  // We need to format the data to be compatible with the chart library
  const chartData = [
    {
      name: "Current Month",
      Income: data.currentMonth?.totalIncome || 0,
      Expenses: data.currentMonth?.totalExpense || 0,
      Savings: data.currentMonth?.totalSavings || 0,
      Investments: data.currentMonth?.totalInvestments || 0,
    },
    {
      name: "Previous Month",
      Income: data.previousMonth?.totalIncome || 0,
      Expenses: data.previousMonth?.totalExpense || 0,
      Savings: data.previousMonth?.totalSavings || 0,
      Investments: data.previousMonth?.totalInvestments || 0,
    },
  ];

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Income" fill="#28a745" />
          <Bar dataKey="Expenses" fill="#dc3545" />
          <Bar dataKey="Savings" fill="#17a2b8" />
          <Bar dataKey="Investments" fill="#ffc107" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SummaryChart;
