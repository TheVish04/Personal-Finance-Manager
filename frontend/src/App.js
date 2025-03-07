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
import AddMoney from './pages/AddMoney';
import AddExpense from './pages/AddExpense';

function App() {
  const navigate = useNavigate();
  // Initialize loggedIn state based on token presence in localStorage
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  // Callback after successful login
  const handleLoginSuccess = () => setLoggedIn(true);

  // Callback after successful registration (Option B: redirect to login)
  const handleRegisterSuccess = () => setLoggedIn(true);

  // Logout: clear token, update state, and redirect to Info page
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
          <Route path="/" element={<Navigate to="/info" />} />
          <Route path="/info" element={<Info />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register onRegisterSuccess={handleRegisterSuccess} />} />
          <Route path="/dashboard" element={loggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/add-money" element={loggedIn ? <AddMoney /> : <Navigate to="/login" />} />
          <Route path="/add-expense" element={loggedIn ? <AddExpense /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
