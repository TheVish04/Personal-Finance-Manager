// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const [backendMessage, setBackendMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then((response) => {
        setBackendMessage(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data from backend:', error);
      });
  }, []);

  // Use this to navigate in the logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoggedIn(false);
    // If you’re storing a token, remove it here:
    // localStorage.removeItem('token');
    // Then redirect to the home or login page
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Personal Finance Manager</h1>
      <p>Backend says: {backendMessage}</p>

      <nav style={{ marginBottom: '1rem' }}>
        {!loggedIn && (
          <>
            <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
            <Link to="/register" style={{ marginRight: '1rem' }}>Register</Link>
          </>
        )}
        {loggedIn && (
          <>
            <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>

      <hr />

      <Routes>
        <Route
          path="/login"
          element={<Login onLoginSuccess={() => setLoggedIn(true)} />}
        />
        <Route
          path="/register"
          element={<Register onRegisterSuccess={() => setLoggedIn(true)} />}
        />
        
        {/* Protected route for the dashboard */}
        <Route
          path="/dashboard"
          element={
            loggedIn ? <Dashboard /> : <Navigate to="/login" />
          }
        />
        
        <Route path="/" element={<div>Welcome! Please choose an option above.</div>} />
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
