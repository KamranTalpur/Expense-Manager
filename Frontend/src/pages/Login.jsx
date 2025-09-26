// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
  background-color: ${props => props.theme.background};
`;

const Form = styled.form`
  background: ${props => props.theme.cardBackground};
  padding: 2rem;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  box-shadow: ${props =>
    props.theme.body === '#0f172a'
      ? '0 8px 20px rgba(255, 255, 255, 0.05)'
      : '0 2px 10px rgba(0, 0, 0, 0.1)'};
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  text-align: center;
  color: ${props => props.theme.text};
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 5px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  transition: border 0.3s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 0.5rem;

  &:hover {
    background-color: ${props => props.theme.secondary};
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 1rem;
`;

const SignUpLink = styled.div`
  margin-top: 1rem;
  text-align: center;
  color: ${props => props.theme.text};

  a {
    color: ${props => props.theme.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Failed to log in');
      }
    } catch (err) {
      setError('Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>Log In</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <FormGroup>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        <Button disabled={loading} type="submit">
          {loading ? 'Logging In...' : 'Log In'}
        </Button>
        <SignUpLink>
          Don&apos;t have an account? <Link to="/register">Sign Up</Link>
        </SignUpLink>
      </Form>
    </Container>
  );
};

export default Login;
