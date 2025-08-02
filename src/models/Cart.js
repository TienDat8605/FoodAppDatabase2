const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartItemSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },   
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1, // Ensure quantity is at least 1
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});