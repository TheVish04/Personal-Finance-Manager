// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Importing the page components (make sure these files exist)
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {
    // Fetch a test message from the backend
    axios.get('http://localhost:5000/')
      .then((response) => {
        setBackendMessage(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data from backend:', error);
      });
  }, []);

  return (
    <Router>
      <div className="App" style={{ padding: '2rem' }}>
        <header>
          <h1>Personal Finance Manager</h1>
          <p>Backend says: {backendMessage}</p>
          <nav style={{ marginTop: '1rem' }}>
            <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
            <Link to="/register" style={{ marginRight: '1rem' }}>Register</Link>
            <Link to="/dashboard">Dashboard</Link>
          </nav>
        </header>
        <main style={{ marginTop: '2rem' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Default route */}
            <Route path="/" element={<div>Welcome! Please use the navigation above to get started.</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
