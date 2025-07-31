require('dotenv').config(); // Load .env variables
const PORT = process.env.PORT || 3000;

const express = require('express');
const app = express();
const connectDB = require('./config/database'); // Adjust path as necessary
const cors = require('cors');
const mongoose = require('mongoose');
const upload = require('./middlewares/multerMiddleware'); // Adjust path as necessary

connectDB();
app.use(express.json());
app.use(cors());
app.use('/api/auth/register', require('./routes/api/auth/register'));
app.use('/api/auth/login', require('./routes/api/auth/login'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/food', require('./routes/food'));


mongoose.connection.once('open', () => {
  console.log('MongoDB connection established');
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});