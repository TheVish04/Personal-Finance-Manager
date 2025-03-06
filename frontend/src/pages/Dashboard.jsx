// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    // Establish a single socket connection when the component mounts
    socketRef.current = io('http://localhost:5000');
    const socket = socketRef.current;

    // Listen for real-time events
    socket.on('expenseCreated', (newExpense) => {
      console.log('Expense created:', newExpense);
      setExpenses((prev) => [...prev, newExpense]);
    });

    socket.on('expenseUpdated', (updatedExpense) => {
      console.log('Expense updated:', updatedExpense);
      setExpenses((prev) =>
        prev.map((exp) => (exp._id === updatedExpense._id ? updatedExpense : exp))
      );
    });

    socket.on('expenseDeleted', (deletedExpenseId) => {
      console.log('Expense deleted:', deletedExpenseId);
      setExpenses((prev) => prev.filter((exp) => exp._id !== deletedExpenseId));
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Fetch initial expenses from backend on component mount
    const token = localStorage.getItem('token');
    axios
      .get('http://localhost:5000/api/expenses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setExpenses(response.data))
      .catch((error) => console.error('Error fetching expenses:', error));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Expenses (Real-Time)</h1>
      {expenses.length === 0 ? (
        <p>No expenses available.</p>
      ) : (
        <ul>
          {expenses.map((exp) => (
            <li key={exp._id}>
              {exp.title} - {exp.amount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
