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
  name:{
    type: String,
    required: true,
  },
  toppings: [{
    name: String,
    price: Number,
  }],
  quantity: {
    type: Number,
    required: true,
    min: 1, // Ensure quantity is at least 1
  },
  price: {
    type: Number,
    required: true,
  },
  selected: {
    type: Boolean,
    default: true, // Default to true, meaning the item is selected in the cart
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

module.exports = mongoose.model('Cart', cartItemSchema);