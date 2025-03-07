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
// Import any other pages you have, e.g., UploadReceipt, etc.

function App() {
  const navigate = useNavigate();

  // 1. On mount, check if there's a token in localStorage.
  // If yes, we set loggedIn to true; if not, false.
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  // Called after a successful login in Login.jsx
  const handleLoginSuccess = () => {
    setLoggedIn(true);
  };

  // Called after a successful registration in Register.jsx
  // (But remember, in Option B, we do NOT auto-login after register)
  const handleRegisterSuccess = () => {
    // Optionally do something, or navigate to /login
  };

  // Called when the user clicks "Logout" in the header
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Set loggedIn to false
    setLoggedIn(false);
    // Navigate user to info page (or wherever you want)
    navigate('/info');
  };

  return (
    <>
      {/* The header receives the loggedIn state and a logout handler */}
      <Header loggedIn={loggedIn} handleLogout={handleLogout} />

      <div style={{ padding: '1rem' }}>
        <Routes>
          {/* Default route goes to /info */}
          <Route path="/" element={<Navigate to="/info" />} />

          {/* Public routes */}
          <Route path="/info" element={<Info />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Login & Register routes */}
          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
            path="/register"
            element={<Register onRegisterSuccess={handleRegisterSuccess} />}
          />

          {/* Protected routes (require loggedIn = true) */}
          <Route
            path="/dashboard"
            element={loggedIn ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/add-money"
            element={loggedIn ? <AddMoney /> : <Navigate to="/login" />}
          />
          <Route
            path="/add-expense"
            element={loggedIn ? <AddExpense /> : <Navigate to="/login" />}
          />

          {/* Add any additional protected routes here, e.g., UploadReceipt */}
          {/* <Route
            path="/upload-receipt/:id"
            element={loggedIn ? <UploadReceipt /> : <Navigate to="/login" />}
          /> */}
        </Routes>
      </div>
    </>
  );
}

export default App;
