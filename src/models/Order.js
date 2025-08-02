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
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});