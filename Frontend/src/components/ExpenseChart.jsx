// frontend/src/components/ExpenseChart.jsx
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import styled, { useTheme } from "styled-components";

const ChartContainer = styled.div`
  background-color: ${(props) => props.theme.cardBackground};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: ${(props) => props.theme.cardShadow};
  border: 1px solid ${(props) => props.theme.border};
  transition: background 0.3s ease, color 0.3s ease;

  h2 {
    color: ${(props) => props.theme.primary};
    margin-bottom: 1rem;
  }

  p {
    color: ${(props) => props.theme.text};
  }
`;

const ExpenseChart = ({ expenses }) => {
  const theme = useTheme();

  // Group expenses by category
  const categoryData = expenses.reduce((acc, expense) => {
    const category = expense.reason;
    if (!acc[category]) acc[category] = 0;
    acc[category] += expense.amount;
    return acc;
  }, {});

  // Format data for the chart
  const chartData = Object.keys(categoryData).map((category) => ({
    name: category.replace("_", " ").toUpperCase(),
    value: categoryData[category],
  }));

  // Colors for the chart
  const COLORS = [
    theme.primary,
    theme.secondary,
    theme.accent,
    "#FFBB28",
    "#FF8042",
    "#8884D8",
  ];

  return (
    <ChartContainer>
      <h2>Expense Distribution</h2>
      {expenses.length === 0 ? (
        <p>No expenses to display</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={120}
              fill={theme.primary}
              dataKey="value">
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`Rs ${value}`, "Amount"]}
              contentStyle={{
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
                color: theme.text,
              }}
            />
            <Legend
              wrapperStyle={{
                color: theme.text,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartContainer>
  );
};

export default ExpenseChart;
