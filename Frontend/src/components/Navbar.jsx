// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";



const Nav = styled.nav`
  background-color: ${(props) => props.theme.cardBackground};
  color: ${(props) => props.theme.text};
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${(props) => props.theme.border};
  transition: background 0.3s ease, color 0.3s ease;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.text};
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: ${(props) =>
      props.theme.primary}33; /* slight transparent hover */
    color: ${(props) => props.theme.primary};
  }
`;

const Button = styled.button`
  background: ${(props) => props.theme.primary};
  color: white;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s, color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.secondary};
  }
`;

const Navbar = ({ toggleTheme, theme }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Nav>
      <div>
        <StyledLink to="/">Expense Manager</StyledLink>
      </div>
      
      <NavLinks>
        {currentUser ? (
          <>
            <StyledLink to="/">Dashboard</StyledLink>
            <StyledLink to="/settings">Settings</StyledLink>
            <Button onClick={toggleTheme}>
              {theme === "light" ? "Dark" : "Light"} Mode
            </Button>
            <Button onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <StyledLink to="/login">Login</StyledLink>
            <StyledLink to="/register">Register</StyledLink>
            <Button onClick={toggleTheme}>
              {theme === "light" ? "Dark" : "Light"} Mode
            </Button>
          </>
        )}
      </NavLinks>
    </Nav>
  );
};

export default Navbar;
