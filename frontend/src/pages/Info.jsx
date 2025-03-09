// frontend/src/pages/Info.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function Info() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '2rem' }}
    >
      {/* Hero Section */}
      <section
        style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: '#1e88e5',
          color: '#fff',
          borderRadius: '8px',
          marginBottom: '2rem',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          Welcome to Personal Finance Manager
        </h1>
        <p style={{ fontSize: '1.2rem' }}>
          Take control of your finances with real-time tracking, budgeting, and insightful analytics.
        </p>
        <div style={{ marginTop: '2rem' }}>
          <Link
            to="/register"
            style={{
              marginRight: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#fff',
              color: '#1e88e5',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            Get Started
          </Link>
          <Link
            to="/login"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'transparent',
              color: '#fff',
              border: '1px solid #fff',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ textAlign: 'center' }}>Why Choose Us?</h2>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '1rem',
          }}
        >
          <div
            style={{
              flex: '1 1 250px',
              maxWidth: '300px',
              padding: '1rem',
              borderRadius: '8px',
              boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
              backgroundColor: '#fff',
            }}
          >
            <h3 style={{ textAlign: 'center' }}>Real-Time Tracking</h3>
            <p style={{ textAlign: 'center' }}>
              Instant updates on your transactions with real-time data synchronization.
            </p>
          </div>
          <div
            style={{
              flex: '1 1 250px',
              maxWidth: '300px',
              padding: '1rem',
              borderRadius: '8px',
              boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
              backgroundColor: '#fff',
            }}
          >
            <h3 style={{ textAlign: 'center' }}>Easy Budgeting</h3>
            <p style={{ textAlign: 'center' }}>
              Set your monthly budget and monitor your spending effortlessly.
            </p>
          </div>
          <div
            style={{
              flex: '1 1 250px',
              maxWidth: '300px',
              padding: '1rem',
              borderRadius: '8px',
              boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
              backgroundColor: '#fff',
            }}
          >
            <h3 style={{ textAlign: 'center' }}>Insightful Analytics</h3>
            <p style={{ textAlign: 'center' }}>
              Visualize your income and expenses with interactive charts and graphs.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2>Get Started Today</h2>
        <p>Sign up now and take control of your financial future!</p>
        <Link
          to="/register"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#1e88e5',
            color: '#fff',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 'bold',
            marginTop: '1rem',
            display: 'inline-block',
          }}
        >
          Register Now
        </Link>
      </section>
    </motion.div>
  );
}

export default Info;
