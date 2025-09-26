// frontend/src/components/AdvancedExpenseChart.js
import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import styled, { useTheme } from "styled-components";

const ChartWrapper = styled.div`
  background-color: ${(props) => props.theme.cardBackground};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: ${(props) => props.theme.cardShadow};
  border: 1px solid ${(props) => props.theme.border};
  transition: background 0.3s ease, color 0.3s ease;

  .chart-controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;

    select {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      border: 1px solid ${(props) => props.theme.border};
      background-color: ${(props) => props.theme.cardBackground};
      color: ${(props) => props.theme.text};
      cursor: pointer;

      &:focus {
        outline: none;
        border-color: ${(props) => props.theme.primary};
        box-shadow: 0 0 0 2px ${(props) => props.theme.primary}33;
      }
    }
  }

  h2 {
    color: ${(props) => props.theme.primary};
    margin-bottom: 1rem;
  }
`;

const AdvancedExpenseChart = ({ expenses }) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState("bar");
  const [timeRange, setTimeRange] = useState("month");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Process data based on filters
  const chartData = useMemo(() => {
    const filteredExpenses =
      selectedCategory === "all"
        ? expenses
        : expenses.filter((exp) => exp.reason === selectedCategory);

    const groupedData = {};

    filteredExpenses.forEach((expense) => {
      const date = new Date(expense.date);
      let key;

      if (timeRange === "day") {
        key = date.toLocaleDateString();
      } else if (timeRange === "week") {
        const weekNumber = Math.ceil(date.getDate() / 7);
        key = `Week ${weekNumber}, ${date.toLocaleString("default", {
          month: "short",
        })}`;
      } else {
        key = date.toLocaleString("default", { month: "short" });
      }

      if (!groupedData[key]) groupedData[key] = 0;
      groupedData[key] += expense.amount;
    });

    return Object.keys(groupedData).map((key) => ({
      name: key,
      amount: groupedData[key],
    }));
  }, [expenses, timeRange, selectedCategory]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(expenses.map((exp) => exp.reason))];
    return ["all", ...uniqueCategories];
  }, [expenses]);

  const COLORS = [
    theme.primary,
    theme.secondary,
    theme.accent,
    "#FFBB28",
    "#FF8042",
    "#8884D8",
  ];

  return (
    <ChartWrapper>
      <h2>Advanced Expense Chart</h2>
      <div className="chart-controls">
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}>
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
        </select>

        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}>
          <option value="day">By Day</option>
          <option value="week">By Week</option>
          <option value="month">By Month</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all"
                ? "All Categories"
                : cat.replace("_", " ").toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        {chartType === "bar" ? (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
            <XAxis dataKey="name" stroke={theme.text} />
            <YAxis stroke={theme.text} />
            <Tooltip
              formatter={(value) => [`Rs ${value}`, "Amount"]}
              contentStyle={{
                backgroundColor: theme.cardBackground,
                borderColor: theme.border,
                color: theme.text,
              }}
            />
            <Legend wrapperStyle={{ color: theme.text }} />
            <Bar dataKey="amount" fill={theme.primary} name="Spending" />
          </BarChart>
        ) : (
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
              dataKey="amount">
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
          </PieChart>
        )}
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default AdvancedExpenseChart;
