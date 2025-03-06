// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Info from './pages/Info';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  const navigate = useNavigate();
  
  // Always initialize as logged out
  const [loggedIn, setLoggedIn] = useState(false);

  // Clear any token on initial load to force a logged-out state
  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

  // Callback to set login status after a successful login
  const handleLoginSuccess = () => {
    setLoggedIn(true);
  };

  // Callback to set login status after a successful registration
  const handleRegisterSuccess = () => {
    setLoggedIn(true);
  };

  // Logout: clear token, update state, and redirect to the info page
  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    navigate('/info');
  };

  return (
    <>
      <Header loggedIn={loggedIn} handleLogout={handleLogout} />
      <div style={{ padding: '1rem' }}>
        <Routes>
          {/* Default route directs to the landing page */}
          <Route path="/" element={<Navigate to="/info" />} />
          <Route path="/info" element={<Info />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register onRegisterSuccess={handleRegisterSuccess} />} />

          {/* Protected route: only accessible when logged in */}
          <Route path="/dashboard" element={loggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
