const mongoose = require('mongoose');
const { Schema } = mongoose;

const toppingSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
});

module.exports = mongoose.model('Topping', toppingSchema);