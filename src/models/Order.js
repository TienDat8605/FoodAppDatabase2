const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Array of cart items
  cartItems: [{
    foodId : { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Food', 
      required: true },
    name: { type: String, required: true },
    toppings: [{ name: String, price: Number }],
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
  }],
  totalPrice: {
    type: Number,
    required: true,
    default: 0, // Default total price is 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'pending', // Default status is pending, after a certain time it will be confirmed
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  cancelReason: {
    type: String,
    default: '',
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

module.exports = mongoose.model('Order', orderSchema);