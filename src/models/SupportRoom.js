// models/SupportRoom.js
const mongoose = require("mongoose");

const supportRoomSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  isOpen: { type: Boolean, default: true },
  }
  , { timestamps: true }
);

module.exports = mongoose.model("SupportRoom", supportRoomSchema);
