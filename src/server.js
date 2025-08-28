require('dotenv').config(); // Load .env variables
const PORT = process.env.PORT;

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const morgan = require('morgan');

const express = require('express');
const app = express();
const connectDB = require('./config/database'); // Adjust path as necessary
const cors = require('cors');
const mongoose = require('mongoose');
const upload = require('./middlewares/multerMiddleware'); // Adjust path as necessary

connectDB();
// Middleware to parse JSON bodies
app.use(express.json());
// some security features
app.use(helmet()); // Secure HTTP headers
app.use(cors()); // CORS (for mobile you don’t *need* it, but keeping it is fine) 
app.use(rateLimit({ // Rate limiting (basic anti-spam / brute-force guard)
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,                 // limit each IP to 500 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
}));
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(morgan('dev')); // Request logging (for debugging & monitoring)

// Middleware to handle multipart/form-data (for file uploads)
app.use(upload.any()); // Accepts all files

// Define routes
app.use('/api/auth/register', require('./routes/api/auth/register'));
app.use('/api/auth/login', require('./routes/api/auth/login'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/food', require('./routes/api/food'));
app.use('/api/cart', require('./routes/api/cart'));
app.use('/api/order', require('./routes/api/order'));
app.use('/api/review', require('./routes/api/review'));
app.use('/api/topping', require('./routes/api/topping'));
app.use('/api/favorite', require('./routes/api/favorite'));
//Socket.io for real-time chat
const http = require('http');
const { Server } = require('socket.io');
const chatSocket = require('./sockets/chatLogic'); // import socket logic

// Wrap express app
const server = http.createServer(app);

// Setup socket.io
const io = new Server(server, {
  cors: {
    //origin: [process.env.RENDERER_URL || "http://localhost:5173"], 
    origin: "*", //for testing purpose, allow all origins
    credentials: true,
  }
});

// Pass socket.io instance to chat module
chatSocket(io);

mongoose.connection.once('open', () => {
  console.log('MongoDB connection established');
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

