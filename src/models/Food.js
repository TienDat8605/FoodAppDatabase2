const mongoose = require('mongoose');
const { Schema } = mongoose;

const foodSchema = new Schema({
  name: String,
  description: String,
  category: String,
  subcategories: [String],
  price: Number,
  foodPicture: {
    data: Buffer,
    contentType: String,
  },
  embedding: [Number],
  //rating
  rating: {
    type: Number,
    default: 0, // Default rating is 0
  },
  //ratingCount
  ratingCount: {
    type: Number,
    default: 0, // Default rating count is 0
  },
  toppings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topping' }]
});

module.exports = mongoose.model('Food', foodSchema);