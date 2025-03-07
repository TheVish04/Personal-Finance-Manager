// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const socketRef = useRef();

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/expenses', {
        headers: { Authorization: `Bearer ${token}` },
        params: { timestamp: new Date().getTime() } // prevent caching
      });
      console.log("Fetched transactions:", res.data);
      // Ensure res.data is an array before updating state
      if (Array.isArray(res.data)) {
        setTransactions(res.data);
      } else {
        console.error("Expected an array but got:", res.data);
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    // Establish socket connection on mount
    socketRef.current = io('http://localhost:5000');
    const socket = socketRef.current;

    // Listen for real-time expense events
    socket.on('expenseCreated', (newTransaction) => {
      console.log('Socket event - expenseCreated:', newTransaction);
      setTransactions(prev => Array.isArray(prev) ? [newTransaction, ...prev] : [newTransaction]);
    });
    socket.on('expenseUpdated', (updatedTransaction) => {
      console.log('Socket event - expenseUpdated:', updatedTransaction);
      setTransactions(prev =>
        Array.isArray(prev)
          ? prev.map(tx => (tx._id === updatedTransaction._id ? updatedTransaction : tx))
          : [updatedTransaction]
      );
    });
    socket.on('expenseDeleted', (deletedTransactionId) => {
      console.log('Socket event - expenseDeleted:', deletedTransactionId);
      setTransactions(prev =>
        Array.isArray(prev)
          ? prev.filter(tx => tx._id !== deletedTransactionId)
          : []
      );
    });

    // Fetch initial transactions
    fetchTransactions();

    // Cleanup socket on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Calculate totals and prepare pie chart data
  const debitTransactions = (transactions || []).filter(tx => tx.transactionType === 'debit');
  const creditTransactions = (transactions || []).filter(tx => tx.transactionType === 'credit');

  const totalDebit = debitTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalCredit = creditTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0);

  // Group debit transactions by category for the pie chart
  const categoryData = {};
  debitTransactions.forEach(tx => {
    const category = tx.category || 'Uncategorized';
    categoryData[category] = (categoryData[category] || 0) + Number(tx.amount);
  });

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [{
      data: Object.values(categoryData),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8e44ad', '#e74c3c', '#2ecc71'],
    }],
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <div style={{ marginBottom: '2rem' }}>
        <p>Total Credit: <span style={{ color: 'green' }}>{totalCredit}</span></p>
        <p>Total Debit: <span style={{ color: 'red' }}>{totalDebit}</span></p>
      </div>
      <div style={{ maxWidth: '400px', marginBottom: '2rem' }}>
        <h3>Expense Distribution</h3>
        {Object.keys(categoryData).length > 0 ? (
          <Pie data={pieData} />
        ) : (
          <p>No expense data available for chart.</p>
        )}
      </div>
      <div>
        <h3>Transaction Report</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Type</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Title</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Amount</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Category</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions && transactions.length > 0 ? (
              transactions.map(tx => (
                <tr key={tx._id} style={{ backgroundColor: tx.transactionType === 'debit' ? '#ffe6e6' : '#e6ffe6' }}>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{tx.transactionType}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{tx.title || '-'}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{tx.amount}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{tx.category || '-'}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {new Date(tx.date).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '8px' }}>
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <a href="/add-money" style={{ marginRight: '1rem', textDecoration: 'none', color: '#333' }}>Add Money</a>
        <a href="/add-expense" style={{ textDecoration: 'none', color: '#333' }}>Add Expense</a>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button onClick={fetchTransactions}>Refresh Transactions</button>
      </div>
    </div>
  );
}

export default Dashboard;
