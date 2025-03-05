// backend/routes/expenses.js
const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/expenses
// Retrieve all expenses for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    // req.user is set by authMiddleware to the authenticated user's ID
    const expenses = await Expense.find({ user: req.user });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/expenses
// Create a new expense for the authenticated user
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, amount, date, category } = req.body;
    const expense = new Expense({
      user: req.user,
      title,
      amount,
      date: date || Date.now(),
      category,
    });
    await expense.save();
    res.status(201).json({ message: 'Expense created successfully', expense });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/expenses/:id
// Update an existing expense for the authenticated user
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }  // Return the updated document
    );
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense updated successfully', expense });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/expenses/:id
// Delete an expense for the authenticated user
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
