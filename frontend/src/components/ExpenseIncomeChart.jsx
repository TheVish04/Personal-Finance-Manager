// frontend/src/components/ExpenseIncomeChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const ExpenseIncomeChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#4CAF50" name="Income" />
        <Line type="monotone" dataKey="expense" stroke="#F44336" name="Expense" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ExpenseIncomeChart;
