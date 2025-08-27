const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  foodId: { type: Schema.Types.ObjectId, ref: 'Food', required: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  commentText: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
}, 
{ timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);