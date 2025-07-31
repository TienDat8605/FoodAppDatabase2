const express = require('express');
const router = express.Router();
const Food = require('../../models/Food');

// GET /api/food - get all food items
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;