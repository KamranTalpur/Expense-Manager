// frontend/src/components/ExpenseForm.jsx
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import styled from "styled-components";

const FormContainer = styled.form`
  background-color: ${(props) => props.theme.cardBackground};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: ${(props) => props.theme.cardShadow};
  border: 1px solid ${(props) => props.theme.border};
  transition: background 0.3s ease, color 0.3s ease;
  color: ${(props) => props.theme.text};

  h2 {
    color: ${(props) => props.theme.primary};
    margin-bottom: 1rem;
  }

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    input,
    select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid ${(props) => props.theme.border};
      border-radius: 6px;
      background-color: ${(props) => props.theme.background};
      color: ${(props) => props.theme.text};
      transition: border 0.2s ease, background 0.3s ease;

      &:focus {
        border-color: ${(props) => props.theme.primary};
        box-shadow: 0 0 0 2px ${(props) => props.theme.primary}33;
      }
    }
  }

  .success-message {
    color: ${(props) => props.theme.accent};
    margin-bottom: 1rem;
    font-weight: 500;
  }

  .error-message {
    color: ${(props) => props.theme.danger || "#dc2626"};
    margin-bottom: 1rem;
    font-weight: 500;
  }

  button[type="submit"] {
    background-color: ${(props) => props.theme.primary};
    color: #fff;
    border-radius: 6px;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.1s ease;

    &:hover {
      background-color: ${(props) => props.theme.secondary};
      transform: translateY(-1px);
    }
  }
`;

const ExpenseForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    date: new Date(),
    name: "",
    reason: "misc",
    amount: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const categories = ["bills", "leisure", "eat_drink", "travel", "misc"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        date: formData.date,
      };

      const token = localStorage.getItem("token");
      const res = await axios.post("/api/expenses", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Expense added successfully!");
      setTimeout(() => setMessage(""), 3000);

      if (onSubmit) onSubmit(res.data);

      // Reset form
      setFormData({
        date: new Date(),
        name: "",
        reason: "misc",
        amount: "",
      });
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong while adding the expense.");
      }
      setTimeout(() => setError(""), 4000);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <h2>Add Expense</h2>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>Date</label>
        <DatePicker
          selected={formData.date}
          onChange={(date) => setFormData({ ...formData, date })}
        />
      </div>

      <div className="form-group">
        <label>Expense Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          maxLength={50}
          required
        />
      </div>

      <div className="form-group">
        <label>Category</label>
        <select
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          required>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.replace("_", " ").toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">Add Expense</button>
    </FormContainer>
  );
};

export default ExpenseForm;
