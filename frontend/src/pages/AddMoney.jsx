// frontend/src/pages/AddMoney.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddMoney() {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const navigate = useNavigate();

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
        'process.env.REACT_APP_API_URL/api/expenses',
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

      // If successful, navigate to dashboard
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
        />
        <label>Source/Description</label>
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          required
        />
        <button type="submit" style={{ marginTop: '1rem' }}>Add Money</button>
      </form>
    </div>
  );
}

export default AddMoney;
