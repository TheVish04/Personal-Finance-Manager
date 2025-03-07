// frontend/src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Header({ loggedIn, handleLogout }) {
  return (
    <header style={{
      backgroundColor: '#333',
      color: '#fff',
      padding: '1rem',
      textAlign: 'center'
    }}>
      <h1 style={{ margin: 0 }}>Personal Finance Manager</h1>
      <nav style={{ marginTop: '0.5rem' }}>
        {/* Always visible links */}
        <Link to="/info" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>Home</Link>
        <Link to="/about" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>About Us</Link>
        <Link to="/contact" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>Contact</Link>

        {/* Logged-out state */}
        {!loggedIn && (
          <>
            <Link to="/login" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>Register</Link>
          </>
        )}

        {/* Logged-in state */}
        {loggedIn && (
          <>
            <Link to="/dashboard" style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}>Dashboard</Link>
            <button 
              onClick={handleLogout} 
              style={{ background: 'none', border: '1px solid #fff', color: '#fff', cursor: 'pointer' }}
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
