// backend/models/expense.js
const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'Expense' },
  transactionType: {
    type: String,
    required: true,
    enum: ['credit', 'debit'],
  },
  date: { type: Date, default: Date.now },
  receiptPath: { type: String }, // To store the uploaded file path
}, {
  timestamps: true  // createdAt and updatedAt
});

module.exports = mongoose.model('Expense', expenseSchema);
