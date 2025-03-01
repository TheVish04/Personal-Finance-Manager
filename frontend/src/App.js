// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {
    // Replace the URL if your backend is hosted elsewhere
    axios.get('http://localhost:5000/')
      .then((response) => {
        setBackendMessage(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data from backend:', error);
      });
  }, []);

  return (
    <div className="App" style={{ padding: '2rem' }}>
      <h1>Personal Finance Manager</h1>
      <p>Backend says: {backendMessage}</p>
    </div>
  );
}

export default App;
