// frontend/src/tests/ExpenseForm.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ExpenseForm from '../components/ExpenseForm';

describe('ExpenseForm', () => {
  it('renders correctly', () => {
    const { getByLabelText, getByText } = render(<ExpenseForm onSubmit={() => {}} />);
    
    expect(getByLabelText(/date/i)).toBeInTheDocument();
    expect(getByLabelText(/expense name/i)).toBeInTheDocument();
    expect(getByLabelText(/category/i)).toBeInTheDocument();
    expect(getByLabelText(/amount/i)).toBeInTheDocument();
    expect(getByText(/add expense/i)).toBeInTheDocument();
  });
  
  it('submits form data', () => {
    const mockSubmit = jest.fn();
    const { getByLabelText, getByText } = render(<ExpenseForm onSubmit={mockSubmit} />);
    
    fireEvent.change(getByLabelText(/expense name/i), { 
      target: { value: 'Test Expense' } 
    });
    fireEvent.change(getByLabelText(/amount/i), { 
      target: { value: '100' } 
    });
    
    fireEvent.click(getByText(/add expense/i));
    
    expect(mockSubmit).toHaveBeenCalled();
  });
});