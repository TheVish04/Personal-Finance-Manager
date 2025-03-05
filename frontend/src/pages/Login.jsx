// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // <-- Add this

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API call to your backend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      console.log(response.data);

      // If login is successful:
      onLoginSuccess();          // update parent state (loggedIn = true)
      navigate('/dashboard');    // navigate to the dashboard
    } catch (error) {
      console.error('Login error:', error);
      // handle error (e.g., display an error message)
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <label>Email</label>
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        
        <label>Password</label>
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        
        <button type="submit" style={{ marginTop: '1rem' }}>Login</button>
      </form>
    </div>
  );
}

export default Login;
