const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Adjust path as necessary

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials: Email' });
    }
    const isValid = await bcrypt.compare(password, user.password);
    // const isValid = password === user.password;
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid credentials: Password' });
    }
    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ message: 'Login successful', token });
    console.log(`User ${user.email} logged in successfully`);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
    console.error('Login error:', err); // Log the error for debugging
  }
}

module.exports = { handleLogin };