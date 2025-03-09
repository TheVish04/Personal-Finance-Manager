import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddMoney() {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Please log in.');
        return;
      }
      const now = new Date().toISOString();

      const response = await axios.post(
        `${API_URL}/api/expenses`,
        {
          amount,
          title: source,
          date: now,
          transactionType: 'credit',
          category: 'Income',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('AddMoney response:', response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding money:', error);
      alert('Failed to add money.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Add Money</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <label>Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={{ marginBottom: '1rem', padding: '0.5rem' }}
        />
        <label>Source/Description</label>
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          required
          style={{ marginBottom: '1rem', padding: '0.5rem' }}
        />
        <button
          type="submit"
          style={{
            padding: '0.75rem',
            background: '#333',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          Add Money
        </button>
      </form>
    </div>
  );
}

export default AddMoney;
