// models/ChatMessage.js
const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "SupportSession", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
    message: { type: String, required: true, },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatMessage", chatMessageSchema);