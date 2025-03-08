// backend/routes/user.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/user');

// GET /api/user/budget - Get the current user's monthly budget
router.get('/budget', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ monthlyBudget: user.monthlyBudget });
  } catch (error) {
    console.error('Error fetching budget:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/user/budget - Update the monthly budget
router.put('/budget', authMiddleware, async (req, res) => {
  try {
    const { monthlyBudget } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.monthlyBudget = monthlyBudget;
    await user.save();
    res.json({ message: 'Budget updated successfully', monthlyBudget: user.monthlyBudget });
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
