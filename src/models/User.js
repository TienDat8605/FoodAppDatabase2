const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
  // you can add name, roles, etc. here
});

// Hash the password before saving the user
const bcrypt = require('bcrypt');
userSchema.pre('save', async function(next) {
  // Only hash if the password is new or modified
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', userSchema);
