// backend/routes/expenses.js
const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');
const authMiddleware = require('../middleware/authMiddleware');
const io = require('../index'); // import the io instance

// CREATE expense
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

    // Emit an event to all connected clients
    io.emit('expenseCreated', expense);

    res.status(201).json({ message: 'Expense created successfully', expense });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE expense
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Emit an event
    io.emit('expenseUpdated', expense);

    res.json({ message: 'Expense updated successfully', expense });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE expense
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Emit an event
    io.emit('expenseDeleted', expense._id);

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
