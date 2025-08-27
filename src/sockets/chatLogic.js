// chatLogic.js
const ChatMessage = require("../models/ChatMessage");
const SupportSession = require("../models/SupportSession");
const User = require("../models/User");

function chatSocket(io) {
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // ---- USER JOINS ----
    socket.on("joinAsUser", async (userId) => {
      try {
        let session = await SupportSession.findOneAndUpdate(
          { userId },
          { $setOnInsert: { isResolved: false } },
          { upsert: true, new: true }
        );

        socket.userId = userId;
        socket.sessionId = session._id; // cache in socket
        socket.join(session._id.toString()); // join room by session ID

        console.log(`User ${userId} joined with session ${session._id}`);
      } catch (err) {
        console.error("joinAsUser error:", err);
      }
    });

    // ---- ADMIN JOINS ----
    socket.on("joinAsAdmin", async (adminId) => {
      try {
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== "admin") {
          return socket.emit("error", "Unauthorized admin");
        }
        socket.userId = adminId;
        socket.isAdmin = true;
        console.log(`Admin ${adminId} joined`);
      } catch (err) {
        console.error("joinAsAdmin error:", err);
      }
    });

    // ---- ADMIN JOINS USER SESSION ----
    socket.on("joinUserSession", async ({ adminId, userId }) => {
      try {
        // Find the support session for this user and cache sessionId on the admin socket
        const session = await SupportSession.findOne({ userId });
        if (session) {
          socket.sessionId = session._id;
          socket.join(session._id.toString()); // join room by session ID
          console.log(`Admin ${adminId} joined ${userId}'s session (sessionId: ${session._id})`);
        } else {
          console.log(`Admin ${adminId} joined ${userId}'s session (no session found)`);
        }
      } catch (err) {
        console.error("joinUserSession error:", err);
      }
    });

    // ---- CHAT MESSAGE ----
    socket.on("chatMessage", async (data) => {
      try {
        if (!socket.userId) {
          return socket.emit("error", "You must join first.");
        }
        if (!socket.sessionId) {
          return socket.emit("error", "No active session.");
        }
        const msg = await ChatMessage.create({
          sender: socket.userId,
          receiver: data.receiverId,
          message: data.message,
          sessionId: socket.sessionId
        });
        io.to(socket.sessionId).emit("chatMessage", msg);
      } catch (err) {
        console.error("chatMessage error:", err);
      }
    });



    // ---- DISCONNECT ----
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
}

module.exports = chatSocket;
