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
        {/* Home (Info page) is always visible */}
        <Link 
          to="/info" 
          style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}
        >
          Home
        </Link>

        {/* If NOT logged in, show Login & Register */}
        {!loggedIn && (
          <>
            <Link 
              to="/login" 
              style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}
            >
              Register
            </Link>
          </>
        )}

        {/* If logged in, show Dashboard & Logout */}
        {loggedIn && (
          <>
            <Link 
              to="/dashboard" 
              style={{ color: '#fff', marginRight: '1rem', textDecoration: 'none' }}
            >
              Dashboard
            </Link>
            <button 
              onClick={handleLogout} 
              style={{ background: 'none', border: '1px solid #fff', color: '#fff', cursor: 'pointer' }}
            >
              Logout
            </button>
          </>
        )}

        {/* About Us & Contact are always visible */}
        <Link 
          to="/about" 
          style={{ color: '#fff', marginLeft: '1rem', marginRight: '1rem', textDecoration: 'none' }}
        >
          About Us
        </Link>
        <Link 
          to="/contact" 
          style={{ color: '#fff', textDecoration: 'none' }}
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}

export default Header;
