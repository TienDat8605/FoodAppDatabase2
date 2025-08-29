// chatLogic.js
const Message = require("../models/Message");
const SupportRoom = require("../models/SupportRoom");

function chatSocket(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected", socket.id);

    socket.on("joinRoom", async ({ userId, roomId, isAdmin }, cb) => {
      let room;
      if (roomId) {
        room = await SupportRoom.findById(roomId);
      } else {
        // if no roomId, find existing or create a new one for this user
        room = await SupportRoom.findOne({ userId });
        if (!room) {
          room = await SupportRoom.create({
            userId,
            isOpen: true,
          });
        }
      }
      socket.join(room._id.toString());
      if (isAdmin) {
        console.log(`Admin joined room: ${room._id}`);
      } else console.log(`User ${userId} joined room: ${room._id}`);
      // fetch chat history
      const history = await Message.find({ roomId: room._id }).sort({ createdAt: 1 });
      if (cb) cb({ roomId: room._id, history });      
    });
    // New message
    socket.on("chatMessage", async ({ roomId, sender, senderId, text }) => {
      const msg = await Message.create({
        roomId,
        sender,
        senderId,
        text
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
