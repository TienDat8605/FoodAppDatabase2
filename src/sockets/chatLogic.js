// chatLogic.js
const Message = require("../models/Message");
const SupportRoom = require("../models/SupportRoom");

function chatSocket(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected", socket.id);

    // User or admin joins a room
    socket.on("joinRoom", async ({ roomId }, cb) => {
      socket.join(roomId);

      // fetch history from DB
      const history = await Message.find({ roomId }).sort({ createdAt: 1 });

      if (cb) cb(history);
    });

    // New message
    socket.on("chatMessage", async ({ roomId, sender, senderId, text }) => {
      const msg = await Message.create({
        roomId,
        sender,
        senderId,
        text,
        createdAt: new Date()
      });

      io.to(roomId).emit("chatMessage", msg);
    });

    // Admin requests all active rooms
    socket.on("getRooms", async (cb) => {
      const rooms = await SupportRoom.find({ isOpen: true })
        .populate("userId", "email");
      cb(rooms);
    });
    // Admin closes a ticket
    socket.on("closeRoom", async (roomId, cb) => {
      const room = await SupportRoom.findByIdAndUpdate(
        roomId,
        { isOpen: false },
        { new: true }
      );
      if (cb) cb(room);

      // notify users in the room
      io.to(roomId).emit("roomClosed", { roomId });
    });
  });
}

module.exports = chatSocket;
