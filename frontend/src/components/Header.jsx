// filepath: /Users/vishal/Documents/personal-finance-manager/frontend/src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const HeaderContainer = styled(motion.header)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavLink = styled(Link)`
  margin: 0 1rem;
  color: ${({ theme }) => theme.colors.white};
  text-decoration: none;
`;

const LogoutButton = styled.button`
  margin: 0 1rem;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
`;

function Header({ loggedIn, handleLogout }) {
  return (
    <HeaderContainer
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        Personal Finance Manager
      </div>
      <nav>
        <NavLink to="/info">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        {!loggedIn ? (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/budget">Budget Settings</NavLink>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </>
        )}
      </nav>
    </HeaderContainer>
  );
}

export default Header;