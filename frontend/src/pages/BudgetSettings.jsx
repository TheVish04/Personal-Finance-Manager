// frontend/src/pages/BudgetSettings.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function BudgetSettings() {
  const [budget, setBudget] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get('process.env.REACT_APP_API_URL/api/user/budget', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setBudget(res.data.monthlyBudget || 0);
      })
      .catch((err) => console.error('Error fetching budget:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'process.env.REACT_APP_API_URL/api/user/budget',
        { monthlyBudget: budget },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Budget updated successfully!');
      navigate('/dashboard'); // Redirect to dashboard after updating budget
    } catch (error) {
      console.error('Error updating budget:', error);
      alert('Failed to update budget');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Monthly Budget Settings</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <label>Monthly Budget (₹)</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          required
        />
        <button type="submit" style={{ marginTop: '1rem' }}>Update Budget</button>
      </form>
    </div>
  );
}

export default BudgetSettings;
