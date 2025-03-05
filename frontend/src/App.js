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
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
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
          <Route path="/login" element={<Login onLoginSuccess={() => { setLoggedIn(true); navigate('/dashboard'); }} />} />
          <Route path="/register" element={<Register onRegisterSuccess={() => { setLoggedIn(true); navigate('/dashboard'); }} />} />
          <Route path="/dashboard" element={loggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
