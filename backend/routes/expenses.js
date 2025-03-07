// backend/routes/expenses.js
const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/expenses (protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST /api/expenses (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, transactionType, date } = req.body;
    const newExpense = new Expense({
      userId: req.user.id,
      title,
      amount,
      category: category || 'Expense',
      transactionType, // Expected to be 'credit' or 'debit'
      date: date || new Date(),
    });
    await newExpense.save();

    // Emit Socket.io event for real-time update
    const io = req.app.get("io");
    if (io) {
      io.emit("expenseCreated", newExpense);
    }

    res.status(201).json(newExpense);
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
