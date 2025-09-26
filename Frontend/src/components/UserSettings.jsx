import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  background: ${(props) => props.theme.cardBackground};
  color: ${(props) => props.theme.text};
  border-radius: 12px;
  box-shadow: ${(props) => props.theme.cardShadow};
  transition: background 0.3s, color 0.3s;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${(props) => props.theme.border};

  h3 {
    color: ${(props) => props.theme.secondary};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid ${(props) => props.theme.border};
    border-radius: 6px;
    background: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text};
    transition: border 0.2s ease, background 0.3s ease;
  }
`;

const Button = styled.button`
  background: ${(props) => props.theme.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  margin-right: 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;

  &:hover {
    background: ${(props) => props.theme.secondary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  margin-bottom: 1rem;
  color: ${(props) =>
    props.error ? props.theme.dangerColor : props.theme.accent};
`;

const UserSettings = () => {
  const { currentUser, logout } = useAuth();
  const [formData, setFormData] = useState({
    monthlyLimit: "",
    dailyLimit: "",
    notificationTimes: ["11:00", "15:00", "18:00"],
    monthlySalary: "",
    monthlyBills: "",
    savingAllocation: "",
    monthlySavingGoal: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        monthlyLimit: currentUser.monthlyLimit ?? "",
        dailyLimit: currentUser.dailyLimit ?? "",
        notificationTimes:
          currentUser.notificationTimes?.length > 0
            ? currentUser.notificationTimes
            : ["11:00", "15:00", "18:00"],
        monthlySalary: currentUser.monthlySalary ?? "",
        monthlyBills: currentUser.monthlyBills ?? "",
        savingAllocation: currentUser.savingAllocation ?? "",
        monthlySavingGoal: currentUser.monthlySavingGoal ?? "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleNotificationTimeChange = (index, value) => {
    const newTimes = [...formData.notificationTimes];
    newTimes[index] = value;
    setFormData((prev) => ({
      ...prev,
      notificationTimes: newTimes,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/users/me", formData);
      setMessage("✅ Settings updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating settings:", error);
      setMessage("❌ Error updating settings");
    }
  };

  const handleResetAccount = async () => {
    if (!window.confirm("⚠️ Are you sure? This will delete ALL your expenses!"))
      return;

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.delete("/api/expenses/reset");
      setMessage(res.data.message || "✅ Your account has been reset.");
    } catch (error) {
      console.error("Error resetting account:", error);
      setMessage("❌ Error resetting account");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  return (
    <Container>
      <h2>User Settings</h2>
      {message && <Message>{message}</Message>}

      <form onSubmit={handleSubmit}>
        <FormSection>
          <h3>Budget Limits</h3>
          <FormGroup>
            <label>Monthly Limit (Rs)</label>
            <input
              type="number"
              name="monthlyLimit"
              value={formData.monthlyLimit}
              onChange={handleChange}
              min="0"
            />
          </FormGroup>
          <FormGroup>
            <label>Daily Limit (Rs)</label>
            <input
              type="number"
              name="dailyLimit"
              value={formData.dailyLimit}
              onChange={handleChange}
              min="0"
            />
          </FormGroup>
        </FormSection>

        {currentUser?.userType === "working" && (
          <FormSection>
            <h3>Income & Saving Settings</h3>
            <FormGroup>
              <label>Monthly Salary (Rs)</label>
              <input
                type="number"
                name="monthlySalary"
                value={formData.monthlySalary}
                onChange={handleChange}
                min="0"
              />
            </FormGroup>
            <FormGroup>
              <label>Monthly Bills (Rs)</label>
              <input
                type="number"
                name="monthlyBills"
                value={formData.monthlyBills}
                onChange={handleChange}
                min="0"
              />
            </FormGroup>
            <FormGroup>
              <label>Saving Allocation (%)</label>
              <input
                type="number"
                name="savingAllocation"
                value={formData.savingAllocation}
                onChange={handleChange}
                min="0"
                max="100"
              />
            </FormGroup>
            <FormGroup>
              <label>Monthly Saving Goal (Rs)</label>
              <input
                type="number"
                name="monthlySavingGoal"
                value={formData.monthlySavingGoal}
                onChange={handleChange}
                min="0"
              />
            </FormGroup>
          </FormSection>
        )}

        <FormSection>
          <h3>Notification Times</h3>
          {formData.notificationTimes.map((time, index) => (
            <FormGroup key={index}>
              <label>Notification {index + 1}</label>
              <input
                type="time"
                value={time}
                onChange={(e) =>
                  handleNotificationTimeChange(index, e.target.value)
                }
              />
            </FormGroup>
          ))}
        </FormSection>

        <Button type="submit">💾 Save Settings</Button>
      </form>

      <div style={{ marginTop: "1rem" }}>
        <Button onClick={handleResetAccount} disabled={loading}>
          {loading ? "⏳ Resetting..." : "⚠️ Reset Account"}
        </Button>
        <Button onClick={logout}>🚪 Logout</Button>
      </div>
    </Container>
  );
};

export default UserSettings;
