import { useState, useEffect } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseChart from "../components/ExpenseChart";
import AdvancedExpenseChart from "../components/AdvancedExpenseChart";
import BillSplit from "../components/BillSplit";
import axios from "axios";
import styled from "styled-components";

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const ToggleButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${(props) => props.theme.border};
  background-color: ${(props) =>
    props.active ? props.theme.primary : props.theme.cardBackground};
  color: ${(props) => (props.active ? "white" : props.theme.text)};
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) =>
      props.active ? props.theme.secondary : props.theme.background};
  }
`;

const Dashboard = () => {
  const [activeView, setActiveView] = useState("form");
  const [expenses, setExpenses] = useState([]);

  // Fetch expenses on mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(res.data);
      } catch (err) {
        console.error("Failed to fetch expenses", err);
      }
    };
    fetchExpenses();
  }, []);

  // ✅ Add new expense
  const handleAddExpense = async (expenseData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/expenses", expenseData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenses((prev) => [res.data, ...prev]);
      setActiveView("list");
    } catch (err) {
      console.error("Failed to add expense", err);
      alert(err.response?.data?.message || "Error adding expense");
    }
  };

  // ✅ Delete expense
  const handleDeleteExpense = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
    } catch (err) {
      console.error("Failed to delete expense", err);
      alert("Error deleting expense");
    }
  };

  // ✅ Edit expense - returns a rejected promise on error so caller (ExpenseList) can show it
  const handleEditExpense = async (updatedExpense) => {
    try {
      const token = localStorage.getItem("token");

      // Build a clean payload containing only editable fields
      const payload = {
        name: updatedExpense.name,
        reason: updatedExpense.reason,
        amount: Number(updatedExpense.amount),
      };

      // include date if provided (ISO string expected)
      if (updatedExpense.date) {
        payload.date = updatedExpense.date;
      }

      const res = await axios.put(
        `/api/expenses/${updatedExpense._id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update state with the server's canonical response
      setExpenses((prev) =>
        prev.map((exp) => (exp._id === updatedExpense._id ? res.data : exp))
      );

      // Return response to allow caller to await success
      return res.data;
    } catch (err) {
      console.error("Failed to edit expense", err);
      // Throw so the caller (ExpenseList) can catch and show message
      const message = err.response?.data?.message || "Error editing expense";
      const error = new Error(message);
      error.response = err.response;
      throw error;
    }
  };

  return (
    <DashboardContainer>
      <ViewToggle>
        <ToggleButton
          active={activeView === "form"}
          onClick={() => setActiveView("form")}>
          Add Expense
        </ToggleButton>
        <ToggleButton
          active={activeView === "list"}
          onClick={() => setActiveView("list")}>
          Expenses
        </ToggleButton>
        <ToggleButton
          active={activeView === "chart"}
          onClick={() => setActiveView("chart")}>
          Charts
        </ToggleButton>
        <ToggleButton
          active={activeView === "advanced"}
          onClick={() => setActiveView("advanced")}>
          Advanced Charts
        </ToggleButton>
        <ToggleButton
          active={activeView === "billsplit"}
          onClick={() => setActiveView("billsplit")}>
          Bill Split
        </ToggleButton>
      </ViewToggle>

      {activeView === "form" && <ExpenseForm onSubmit={handleAddExpense} />}
      {activeView === "list" && (
        <ExpenseList
          expenses={expenses}
          onDelete={handleDeleteExpense}
          onEdit={handleEditExpense}
        />
      )}
      {activeView === "chart" && <ExpenseChart expenses={expenses} />}
      {activeView === "advanced" && (
        <AdvancedExpenseChart expenses={expenses} />
      )}
      {activeView === "billsplit" && <BillSplit />}
    </DashboardContainer>
  );
};

export default Dashboard;
