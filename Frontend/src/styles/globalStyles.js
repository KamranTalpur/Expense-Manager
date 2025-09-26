/* src/styles/globalStyles.js */
import { createGlobalStyle } from "styled-components";

export const lightTheme = {
  body: "#f5f7fa",
  text: "#111827",
  primary: "#2563eb", // Blue 600
  secondary: "#4f46e5", // Indigo 600
  accent: "#16a34a", // Emerald 600
  background: "#ffffff",
  cardBackground: "#ffffff",
  border: "#e5e7eb", // Gray 200
  cardShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

export const darkTheme = {
  body: "#0f172a",
  text: "#f9fafb",
  primary: "#3b82f6", // Blue 500
  secondary: "#6366f1", // Indigo 500
  accent: "#22c55e", // Emerald 500
  background: "#0f172a",
  cardBackground: "#1e293b",
  border: "#334155", // Slate 700
  cardShadow: "0 4px 12px rgba(0,0,0,0.4)",
};

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background: ${(props) => props.theme.body};
    color: ${(props) => props.theme.text};
    font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    transition: background 0.3s ease, color 0.3s ease;
  }

  a {
    text-decoration: none;
    color: ${(props) => props.theme.primary};
    font-weight: 500;
    
    &:hover {
      color: ${(props) => props.theme.secondary};
    }
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    background: ${(props) => props.theme.primary};
    color: white;
    padding: 10px 18px;
    border-radius: 6px;
    font-weight: 500;
    transition: background 0.2s ease, transform 0.1s ease;
    
    &:hover {
      background: ${(props) => props.theme.secondary};
      transform: translateY(-1px);
    }
  }

  input, select, textarea {
    outline: none;
    background: ${(props) => props.theme.cardBackground};
    color: ${(props) => props.theme.text};
    border: 1px solid ${(props) => props.theme.border};
    padding: 10px 14px;
    border-radius: 6px;
    transition: border 0.2s ease, background 0.3s ease;
    
    &:focus {
      border-color: ${(props) => props.theme.primary};
      box-shadow: 0 0 0 2px ${(props) => props.theme.primary}33;
    }
  }

  .card {
    background: ${(props) => props.theme.cardBackground};
    border-radius: 12px;
    padding: 24px;
    box-shadow: ${(props) => props.theme.cardShadow};
    border: 1px solid ${(props) => props.theme.border};
    transition: background 0.3s ease, border 0.3s ease;
  }
`;
