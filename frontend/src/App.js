// frontend/src/App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Info from './pages/Info';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  // Determine if a token is in localStorage at startup
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  // Called after successful login
  const handleLoginSuccess = () => {
    setLoggedIn(true);
  };

  // Called after successful registration
  const handleRegisterSuccess = () => {
    setLoggedIn(true);
  };

  // Called when user clicks Logout
  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    // Update loggedIn state
    setLoggedIn(false);
    // Redirect to Home/Info page
    navigate('/info');
  };

  return (
    <>
      {/* Pass loggedIn and handleLogout to Header */}
      <Header loggedIn={loggedIn} handleLogout={handleLogout} />

      <div style={{ padding: '1rem' }}>
        <Routes>
          {/* Default route goes to /info */}
          <Route path="/" element={<Navigate to="/info" />} />

          {/* Public routes */}
          <Route path="/info" element={<Info />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Login route: pass handleLoginSuccess */}
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />

          {/* Register route: pass handleRegisterSuccess */}
          <Route
            path="/register"
            element={<Register onRegisterSuccess={handleRegisterSuccess} />}
          />

          {/* Protected route for Dashboard */}
          <Route
            path="/dashboard"
            element={
              loggedIn ? <Dashboard /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
