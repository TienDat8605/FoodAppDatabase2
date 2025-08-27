import mongoose from "mongoose";
import dotenv from "dotenv";
import { io as Client } from "socket.io-client";
import User from "./models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
console.log("Connected to MongoDB");

// find first admin and user
const admin = await User.findOne({ role: "admin" });
const user = await User.findOne({ role: "user" });

console.log("Admin:", admin.email, admin._id.toString());
console.log("User:", user.email, user._id.toString());

if (!admin || !user) {
  console.error("Admin or user not found in database.");
  process.exit(1);
}

async function main() {
  const adminSocket = Client("http://localhost:5000");
  const userSocket = Client("http://localhost:5000");
  adminSocket.on("connect", () => {
    console.log("Admin connected:", adminSocket.id);
    adminSocket.emit("joinAsAdmin", admin._id.toString());
  });
  userSocket.on("connect", () => {
    console.log("User connected:", userSocket.id);
    userSocket.emit("joinAsUser", user._id.toString());
    // Wait for a short delay to ensure session is created
    setTimeout(() => {
      // Now admin joins user's session
      adminSocket.emit("joinUserSession", {
        adminId: admin._id.toString(),
        userId: user._id.toString(),
      });
      // User sends message to admin
      setTimeout(() => {
        userSocket.emit("chatMessage", {
          receiverId: admin._id.toString(),
          message: "Hello Admin, I need help!",
        });
      }, 500);
      // Admin sends message to user after another delay
      setTimeout(() => {
        adminSocket.emit("chatMessage", {
          receiverId: user._id.toString(),
          message: "Hello User, this is Admin!",
        });
      }, 1000);
    }, 1000); // 1 second delay to ensure session creation
  });

  adminSocket.on("chatMessage", (msg) => {
    console.log("Admin received:", msg);
  });

  userSocket.on("chatMessage", (msg) => {
    console.log("User received:", msg);
  });
}

await main();
