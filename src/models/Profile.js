const mongoose = require('mongoose');
const { Schema } = mongoose;

const profileSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: Date, required: true },
  profilePicture: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model('Profile', profileSchema);