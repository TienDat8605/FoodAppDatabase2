require('dotenv').config(); // Load .env variables
const PORT = process.env.PORT || 3000;

const express = require('express');
const app = express();
const connectDB = require('./config/database'); // Adjust path as necessary
const cors = require('cors');

connectDB();
app.use(express.json());
app.use(cors());
app.use('/api/auth/register', require('./routes/api/auth/register'));
app.use('/api/auth/login', require('./routes/api/auth/login'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});