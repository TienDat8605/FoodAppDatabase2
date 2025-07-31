const mongoose = require('mongoose');
const { Schema } = mongoose;

const foodSchema = new Schema({
  name: String,
  description: String,
  category: String,
  subcategories: [String],
  price: Number,
  image: {
    data: Buffer,
    contentType: String,
    filename: String
  },
  embedding: [Number]
});

module.exports = mongoose.model('Food', foodSchema);