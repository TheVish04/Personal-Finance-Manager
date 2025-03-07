// backend/routes/expenses.js
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const Expense = require('../models/expense');
const authMiddleware = require('../middleware/authMiddleware');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files will be stored in the "uploads" folder at the project root
  },
  filename: (req, file, cb) => {
    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `receipt-${uniqueSuffix}${ext}`);
  }
});
const upload = multer({ storage });

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

// POST /api/expenses (protected) - Create expense
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, transactionType, date } = req.body;
    const newExpense = new Expense({
      userId: req.user.id,
      title,
      amount,
      category: category || 'Expense',
      transactionType,
      date: date || new Date(),
    });
    await newExpense.save();

    // Emit Socket.io event for real-time update if needed:
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

// PUT /api/expenses/:id (protected) - Edit expense
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, transactionType, date } = req.body;
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (expense.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    expense.title = title || expense.title;
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.transactionType = transactionType || expense.transactionType;
    expense.date = date || expense.date;
    await expense.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("expenseUpdated", expense);
    }
    res.json({ message: "Expense updated successfully", expense });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE /api/expenses/:id (protected) - Delete expense
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    if (expense.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await expense.deleteOne();

    const io = req.app.get("io");
    if (io) {
      io.emit("expenseDeleted", { id: req.params.id });
    }
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// NEW: POST /api/expenses/:id/receipt (protected)
// Route to upload a receipt file for a given expense
router.post('/:id/receipt', authMiddleware, upload.single('receipt'), async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    if (expense.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // Save the file path in the expense document
    expense.receiptPath = req.file.path;
    await expense.save();

    // Optionally emit an update event
    const io = req.app.get("io");
    if (io) {
      io.emit("expenseUpdated", expense);
    }

    res.json({ message: "Receipt uploaded successfully", expense });
  } catch (error) {
    console.error("Error uploading receipt:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
