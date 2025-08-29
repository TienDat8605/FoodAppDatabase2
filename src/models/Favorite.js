const mongoose = require('mongoose');
const { Schema } = mongoose;

const favoriteSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    foods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }]
},
{ timestamps: true }
);

module.exports = mongoose.model('Favorite', favoriteSchema);