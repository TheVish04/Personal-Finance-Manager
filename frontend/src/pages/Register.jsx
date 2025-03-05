// frontend/src/pages/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register({ onRegisterSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // <-- Add this

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API call to your backend
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password
      });
      console.log(response.data);

      // If registration is successful:
      onRegisterSuccess();         // update parent state (loggedIn = true)
      navigate('/dashboard');      // navigate to the dashboard
    } catch (error) {
      console.error('Register error:', error);
      // handle error (e.g., display an error message)
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <label>Name</label>
        <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required 
        />
        
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
        
        <button type="submit" style={{ marginTop: '1rem' }}>Register</button>
      </form>
    </div>
  );
}

export default Register;
