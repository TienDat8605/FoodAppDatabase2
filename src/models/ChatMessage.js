// models/ChatMessage.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "SupportRoom", required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sender: { type: String, enum: ["user", "admin"], required: true },
  text: { type: String, required: true, },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);