// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";
import ExpenseIncomeChart from "../components/ExpenseIncomeChart";

Chart.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [userName, setUserName] = useState(""); // Will store the user's name
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [editExpense, setEditExpense] = useState(null);
  const socketRef = useRef();
  const API_URL = process.env.REACT_APP_API_URL;

  // Alternative: Retrieve the user's name from localStorage
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { timestamp: new Date().getTime() },
      });
      console.log("Fetched transactions:", res.data);
      if (Array.isArray(res.data)) {
        setTransactions(res.data);
        setChartData(processChartData(res.data));
      } else {
        console.error("Expected an array but got:", res.data);
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    socketRef.current = io(`${API_URL}`);
    const socket = socketRef.current;

    socket.on("expenseCreated", (newTransaction) => {
      console.log("Socket event - expenseCreated:", newTransaction);
      const updated = [newTransaction, ...transactions];
      setTransactions(updated);
      setChartData(processChartData(updated));
    });
    socket.on("expenseUpdated", (updatedTransaction) => {
      console.log("Socket event - expenseUpdated:", updatedTransaction);
      const updated = transactions.map((tx) =>
        tx._id === updatedTransaction._id ? updatedTransaction : tx
      );
      setTransactions(updated);
      setChartData(processChartData(updated));
    });
    socket.on("expenseDeleted", ({ id }) => {
      console.log("Socket event - expenseDeleted:", id);
      const updated = transactions.filter((tx) => tx._id !== id);
      setTransactions(updated);
      setChartData(processChartData(updated));
    });

    fetchTransactions();

    return () => {
      socket.disconnect();
    };
  }, []);

  // Group transactions by hour for the Expense & Income Graph
  const processChartData = (transactions) => {
    const grouped = {};
    transactions.forEach(({ transactionType, amount, date }) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, "0");
      const day = d.getDate().toString().padStart(2, "0");
      const hour = d.getHours().toString().padStart(2, "0");
      // Group by hour interval, e.g., "2025-03-07 14:00"
      const formattedDate = `${year}-${month}-${day} ${hour}:00`;
      if (!grouped[formattedDate]) {
        grouped[formattedDate] = { date: formattedDate, income: 0, expense: 0 };
      }
      if (transactionType === "credit") {
        grouped[formattedDate].income += Number(amount);
      } else {
        grouped[formattedDate].expense += Number(amount);
      }
    });
    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Process transactions by title for pie charts
  const processPieDataByTitle = (txs) => {
    const dataMap = {};
    txs.forEach(({ title, amount }) => {
      dataMap[title] = (dataMap[title] || 0) + Number(amount);
    });
    return {
      labels: Object.keys(dataMap),
      datasets: [
        {
          data: Object.values(dataMap),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#8e44ad",
            "#e74c3c",
            "#2ecc71",
            "#f39c12",
            "#3498db",
            "#9b59b6",
            "#1abc9c",
          ],
        },
      ],
    };
  };

  const creditTransactions = transactions.filter((tx) => tx.transactionType === "credit");
  const debitTransactions = transactions.filter((tx) => tx.transactionType === "debit");

  const totalCredit = creditTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalDebit = debitTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const remainingBalance = totalCredit - totalDebit;

  const incomePieData = processPieDataByTitle(creditTransactions);
  const expensePieData = processPieDataByTitle(debitTransactions);

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: { size: 12 },
          boxWidth: 20,
          boxHeight: 20,
          padding: 10,
          generateLabels: (chart) => {
            const dataset = chart.data.datasets[0];
            const total = dataset.data.reduce((acc, value) => acc + Number(value), 0);
            return chart.data.labels.map((label, i) => {
              const value = dataset.data[i];
              const percentage = total ? ((value / total) * 100).toFixed(1) + "%" : "0%";
              return {
                text: `${label}: ₹${value} (${percentage})`,
                fillStyle: dataset.backgroundColor[i],
                hidden: isNaN(dataset.data[i]) || chart.getDatasetMeta(0).data[i].hidden,
                index: i,
              };
            });
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const total = context.dataset.data.reduce((acc, val) => acc + Number(val), 0);
            const percentage = total ? ((value / total) * 100).toFixed(1) + "%" : "0%";
            return `${context.label}: ₹${value} (${percentage})`;
          },
        },
      },
    },
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = transactions.filter((tx) => tx._id !== id);
      setTransactions(updated);
      setChartData(processChartData(updated));
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense.");
    }
  };

  const handleEdit = (expense) => {
    setEditExpense(expense);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/api/expenses/${editExpense._id}`,
        editExpense,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = transactions.map((tx) =>
        tx._id === editExpense._id ? response.data.expense : tx
      );
      setTransactions(updated);
      setChartData(processChartData(updated));
      setEditExpense(null);
    } catch (error) {
      console.error("Error updating expense:", error);
      alert("Failed to update expense.");
    }
  };

  // CSV Export Functionality
  const exportToCSV = () => {
    if (transactions.length === 0) {
      alert("No transactions to export.");
      return;
    }
    const headers = ["Type", "Title", "Amount", "Category", "Date", "Updated On"];
    const rows = transactions.map((tx) => [
      tx.transactionType,
      tx.title,
      tx.amount,
      tx.category || "",
      new Date(tx.date).toLocaleString(),
      tx.updatedAt ? new Date(tx.updatedAt).toLocaleString() : ""
    ]);
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    rows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper: Group transactions by month-year for monthly report
  const groupTransactionsByMonth = (transactions) => {
    return transactions.reduce((acc, txn) => {
      const d = new Date(txn.date);
      const monthYear = `${d.getFullYear()}-${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(txn);
      return acc;
    }, {});
  };

  const monthlyTransactions = groupTransactionsByMonth(transactions);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ padding: "2rem", position: "relative" }}
    >
      {/* Greeting */}
      {userName && (
        <p style={{ fontSize: "1.2rem", margin: "0 0 0.5rem 0" }}>
          Hello, <strong>{userName}</strong>
        </p>
      )}

      {/* Row container for heading + add buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <a
            href="/add-money"
            style={{
              padding: "8px 15px",
              backgroundColor: "#28a745",
              color: "#fff",
              borderRadius: "5px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Add Money
          </a>
          <a
            href="/add-expense"
            style={{
              padding: "8px 15px",
              backgroundColor: "#dc3545",
              color: "#fff",
              borderRadius: "5px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Add Expense
          </a>
        </div>
      </div>

      <div style={{ marginBottom: "2rem", marginTop: "1rem" }}>
        <p>
          Total Credit: <span style={{ color: "green" }}>₹{totalCredit}</span>
        </p>
        <p>
          Total Debit: <span style={{ color: "red" }}>₹{totalDebit}</span>
        </p>
        <p>
          Remaining Balance: <strong>₹{remainingBalance}</strong>
        </p>
      </div>

      {/* Expense & Income Graph */}
      <div style={{ marginBottom: "2rem" }}>
        <h3>Expense & Income Graph</h3>
        {chartData.length > 0 ? (
          <ExpenseIncomeChart data={chartData} />
        ) : (
          <p>No data available.</p>
        )}
      </div>

      {/* Two Pie Charts: Income and Expense Breakdown by Title */}
      <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "2rem" }}>
        {/* Income Pie Chart */}
        <div style={{ width: "450px", height: "400px", border: "1px solid #ccc", padding: "1rem" }}>
          <h3>Income Breakdown (by Source)</h3>
          {creditTransactions.length > 0 ? (
            <div style={{ width: "100%", height: "100%" }}>
              <Pie data={incomePieData} options={pieOptions} />
            </div>
          ) : (
            <p>No income data available.</p>
          )}
        </div>

        {/* Expense Pie Chart */}
        <div style={{ width: "450px", height: "400px", border: "1px solid #ccc", padding: "1rem" }}>
          <h3>Expense Breakdown (by Title)</h3>
          {debitTransactions.length > 0 ? (
            <div style={{ width: "100%", height: "100%" }}>
              <Pie data={expensePieData} options={pieOptions} />
            </div>
          ) : (
            <p>No expense data available.</p>
          )}
        </div>
      </div>

      {/* Export CSV Button */}
      <div style={{ marginBottom: "2rem" }}>
        <button onClick={exportToCSV}>Export CSV</button>
      </div>

      {/* Existing Transactions Table */}
      <div>
        <h3>Transaction Report</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Type</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Title</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Amount</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Category</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Updated On</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions && transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr
                  key={tx._id}
                  style={{
                    backgroundColor: tx.transactionType === "debit" ? "#ffe6e6" : "#e6ffe6",
                  }}
                >
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{tx.transactionType}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{tx.title || "-"}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{tx.amount}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{tx.category || "-"}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{new Date(tx.date).toLocaleString()}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>{tx.updatedAt ? new Date(tx.updatedAt).toLocaleString() : "N/A"}</td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    <button onClick={() => setEditExpense(tx)}>Edit</button>
                    <button onClick={() => handleDelete(tx._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "8px" }}>
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Monthly Transaction Report */}
      <div style={{ marginTop: "3rem" }}>
        <h3>Monthly Transaction Report</h3>
        {Object.keys(monthlyTransactions).length > 0 ? (
          Object.keys(monthlyTransactions)
            .sort()
            .reverse()
            .map((monthYear) => (
              <div key={monthYear} style={{ marginBottom: "2rem" }}>
                <h4>
                  {new Date(`${monthYear}-01`).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </h4>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid #ccc", padding: "8px" }}>Type</th>
                      <th style={{ border: "1px solid #ccc", padding: "8px" }}>Title</th>
                      <th style={{ border: "1px solid #ccc", padding: "8px" }}>Amount</th>
                      <th style={{ border: "1px solid #ccc", padding: "8px" }}>Category</th>
                      <th style={{ border: "1px solid #ccc", padding: "8px" }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyTransactions[monthYear].map((txn) => (
                      <tr key={txn._id} style={{ backgroundColor: txn.transactionType === "debit" ? "#ffe6e6" : "#e6ffe6" }}>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>{txn.transactionType}</td>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>{txn.title || "-"}</td>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>{txn.amount}</td>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>{txn.category || "-"}</td>
                        <td style={{ border: "1px solid #ccc", padding: "8px" }}>{new Date(txn.date).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
        ) : (
          <p>No monthly transactions available.</p>
        )}
      </div>

      {/* Additional Navigation */}
      <div style={{ marginTop: "2rem" }}>
        <a href="/budget" style={{ textDecoration: "none", color: "#333" }}>Budget Settings</a>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={fetchTransactions}>Refresh Transactions</button>
      </div>

      {/* Edit Modal */}
      {editExpense && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "1rem",
              borderRadius: "4px",
              width: "300px",
            }}
          >
            <h3>Edit Expense</h3>
            <label>Title</label>
            <input
              type="text"
              value={editExpense.title}
              onChange={(e) =>
                setEditExpense({ ...editExpense, title: e.target.value })
              }
            />
            <label>Amount</label>
            <input
              type="number"
              value={editExpense.amount}
              onChange={(e) =>
                setEditExpense({ ...editExpense, amount: e.target.value })
              }
            />
            <div style={{ marginTop: "1rem" }}>
              <button onClick={handleUpdate}>Save</button>
              <button onClick={() => setEditExpense(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Dashboard;
