const User = require('../models/User'); // Adjust path as necessary

const handleRegister = async (req, res) => {
  //create a new user
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
    //res.status(201).json({ message: 'User registered', userId: newUser._id });
    console.log(`User ${newUser.email} registered successfully`);
    // attach userId to request for profile creation
    req.user = newUser; // Attach user to request
    next(); // create profile after registration
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
    console.error('Registration error:', err); // Log the error for debugging
  }

}

module.exports = { handleRegister };