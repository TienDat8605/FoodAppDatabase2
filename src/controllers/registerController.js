const User = require('../models/User'); // Adjust path as necessary

const handleRegister = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  try {
    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }
    // Create new user (password will be hashed by pre-save hook)
    const newUser = await User.create({ email, password });
    res.status(201).json({ message: 'User registered', userId: newUser._id });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { handleRegister };