// models/SupportSession.js
const mongoose = require("mongoose");

const supportSessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  isResolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupportSession", supportSessionSchema);
