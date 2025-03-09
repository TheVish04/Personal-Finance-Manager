// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register({ onRegisterSuccess }) {
  // Existing states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // NEW: Confirm password and toggles for show/hide
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Existing code
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match (NEW)
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    // Existing checks
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!passwordRegex.test(password)) {
      alert('Password must be at least 8 chars long, include an uppercase letter and a digit.');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Register error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Register</h2>

      {/* Existing form code */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ marginBottom: '1rem', padding: '0.5rem' }}
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ marginBottom: '1rem', padding: '0.5rem' }}
        />

        <label>Password</label>
        {/* Wrap password input in a relative container for the toggle button */}
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <input
            type={showPassword ? 'text' : 'password'}  // Show/hide
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '0.5rem', width: '100%' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '0.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* NEW: Confirm Password field */}
        <label>Confirm Password</label>
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ padding: '0.5rem', width: '100%' }}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '0.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {showConfirmPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* Existing Register button */}
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
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
