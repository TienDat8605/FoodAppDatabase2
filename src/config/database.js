const mongoose = require('mongoose');
//require('dotenv').config();   // ensure .env is loaded
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });   // ensure .env is loaded from project root

const url = process.env.MONGODB_URI;
if (!url) {
  console.error('MONGODB_URI is not defined in .env');
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(url);
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
