import { useState } from "react";
import axios from "axios";
import styled, { useTheme } from "styled-components";

const BillSplitWrapper = styled.div`
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

  .form-group {
    margin-bottom: 1rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: ${(props) => props.theme.text};
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border-radius: 6px;
      border: 1px solid ${(props) => props.theme.border};
      background-color: ${(props) => props.theme.cardBackground};
      color: ${(props) => props.theme.text};
      transition: border 0.2s ease, background 0.3s ease;

      &:focus {
        border-color: ${(props) => props.theme.primary};
        box-shadow: 0 0 0 2px ${(props) => props.theme.primary}33;
        outline: none;
      }
    }
  }

  button {
    background-color: ${(props) => props.theme.primary};
    color: #fff;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.1s ease;

    &:hover {
      background-color: ${(props) => props.theme.secondary};
      transform: translateY(-1px);
    }
  }

  .result {
    margin-top: 1rem;
    p {
      color: ${(props) => props.theme.text};
      font-weight: 500;
      strong {
        color: ${(props) => props.theme.accent};
      }
    }
  }

  .success-message {
    background-color: ${(props) => props.theme.accent}22;
    color: ${(props) => props.theme.accent};
    padding: 0.5rem 1rem;
    border-radius: 6px;
    margin-bottom: 1rem;
  }
`;

const BillSplit = () => {
  const theme = useTheme();
  const [totalBill, setTotalBill] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [eachShare, setEachShare] = useState(null);
  const [message, setMessage] = useState("");

  const handleSplit = async (e) => {
    e.preventDefault();

    if (!totalBill || !numberOfPeople) return;

    const share = (Number(totalBill) / Number(numberOfPeople)).toFixed(2);
    setEachShare(share);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        date: new Date(),
        name: "Bill Split",
        reason: "bill_split",
        amount: share,
        splitDetails: { totalBill, numberOfPeople },
      };

      await axios.post("/api/expenses", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Bill split saved to expenses!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <BillSplitWrapper>
      <h2>Bill Split</h2>
      {message && <div className="success-message">{message}</div>}

      <form onSubmit={handleSplit}>
        <div className="form-group">
          <label>Total Bill</label>
          <input
            type="number"
            value={totalBill}
            onChange={(e) => setTotalBill(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Number of People</label>
          <input
            type="number"
            value={numberOfPeople}
            onChange={(e) => setNumberOfPeople(e.target.value)}
            required
          />
        </div>

        <button type="submit">Split Bill</button>
      </form>

      {eachShare && (
        <div className="result">
          <p>
            Each person pays: <strong>{eachShare}</strong>
          </p>
        </div>
      )}
    </BillSplitWrapper>
  );
};

export default BillSplit;
