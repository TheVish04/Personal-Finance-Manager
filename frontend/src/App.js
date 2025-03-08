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
import BudgetSettings from './pages/BudgetSettings';

function App() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLoginSuccess = () => {
    setLoggedIn(true);
  };

  const handleRegisterSuccess = () => {
    // Optionally do something or navigate to /login after registration
  };

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
          <Route path="/budget" element={loggedIn ? <BudgetSettings /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
