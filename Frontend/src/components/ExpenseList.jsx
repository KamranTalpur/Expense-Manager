// frontend/src/components/ExpenseList.jsx
import React, { useEffect, useState } from "react";
import { exportToCSV, exportToJSON } from "../utils/exportUtils";
import axios from "axios";
import styled from "styled-components";

const ExpenseContainer = styled.div`
  background-color: ${(props) => props.theme.cardBackground};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: ${(props) => props.theme.cardShadow};
  border: 1px solid ${(props) => props.theme.border};
  overflow-x: auto;
  transition: background 0.3s ease, color 0.3s ease;
  color: ${(props) => props.theme.text};

  h2 {
    margin-bottom: 1rem;
    color: ${(props) => props.theme.primary};
  }

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;

    th,
    td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid ${(props) => props.theme.border};
      transition: background 0.3s ease, color 0.3s ease;
    }

    th {
      background-color: ${(props) => props.theme.primary};
      color: #fff;
      font-weight: 600;
    }

    tr:nth-child(even) {
      background-color: ${(props) => props.theme.body};
    }

    tr:hover {
      background-color: ${(props) => props.theme.secondary};
      color: #fff;
    }
  }

  .export-buttons {
    margin-top: 1rem;

    button {
      background-color: ${(props) => props.theme.primary};
      color: #fff;
      margin-right: 0.5rem;
      transition: background 0.3s ease;

      &:hover {
        background-color: ${(props) => props.theme.secondary};
      }
    }
  }
`;

const ExpenseList = ({ expenses = [], onDelete, onEdit }) => {
  const [allExpenses, setAllExpenses] = useState([]);

  // Fetch user settings and merge with expenses
  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data: user } = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const settingsExpenses = [];

        if (user.monthlySalary) {
          settingsExpenses.push({
            _id: "salary",
            date: new Date(),
            name: "Monthly Salary",
            reason: "income",
            amount: user.monthlySalary,
          });
        }

        if (user.monthlyBills) {
          settingsExpenses.push({
            _id: "bills",
            date: new Date(),
            name: "Monthly Bills",
            reason: "bills",
            amount: user.monthlyBills,
          });
        }

        if (user.savingAllocation) {
          settingsExpenses.push({
            _id: "saving-allocation",
            date: new Date(),
            name: "Saving Allocation",
            reason: "savings",
            amount: user.savingAllocation,
          });
        }

        if (user.monthlySavingGoal) {
          settingsExpenses.push({
            _id: "saving-goal",
            date: new Date(),
            name: "Saving Goal",
            reason: "goal",
            amount: user.monthlySavingGoal,
          });
        }

        setAllExpenses([...expenses, ...settingsExpenses]);
      } catch (error) {
        console.error("Failed to fetch user settings:", error);
        setAllExpenses(expenses);
      }
    };

    fetchUserSettings();
  }, [expenses]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const formatCategory = (category) => {
    if (!category) return "Uncategorized";
    return category.replace("_", " ").toUpperCase();
  };

  const isMongoId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

  const totalAmount = allExpenses.reduce(
    (acc, exp) => acc + (exp.amount || 0),
    0
  );

  return (
    <ExpenseContainer>
      <h2>Your Expenses</h2>

      {allExpenses.length === 0 ? (
        <p>No expenses yet. Add your first expense!</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Category</th>
                <th>Amount (Rs)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allExpenses.map((expense) => (
                <tr key={expense._id}>
                  <td>{formatDate(expense.date)}</td>
                  <td>{expense.name || "-"}</td>
                  <td>{formatCategory(expense.reason)}</td>
                  <td>Rs {expense.amount?.toLocaleString() || 0}</td>
                  <td>
                    {isMongoId(expense._id) ? (
                      <>
                        <button
                          style={{
                            backgroundColor: "var(--secondary-color)",
                            marginRight: "0.5rem",
                          }}
                          onClick={() => onEdit && onEdit(expense)}>
                          ✏️ Edit
                        </button>
                        <button
                          className="logout-btn"
                          onClick={() => onDelete && onDelete(expense._id)}>
                          🗑️ Delete
                        </button>
                      </>
                    ) : (
                      <span style={{ color: "gray", fontStyle: "italic" }}>
                        System Entry
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td style={{ fontWeight: "bold" }}>Total</td>
                <td></td>
                <td></td>
                <td style={{ fontWeight: "bold" }}>
                  Rs {totalAmount.toLocaleString()}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>

          <div className="export-buttons">
            <button onClick={() => exportToCSV(allExpenses)}>
              📑 Export as CSV
            </button>
            <button onClick={() => exportToJSON(allExpenses)}>
              📂 Export as JSON
            </button>
          </div>
        </>
      )}
    </ExpenseContainer>
  );
};

export default ExpenseList;
