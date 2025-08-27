// routes/support.js
const express = require("express");
const ChatMessage = require("../../models/ChatMessage");
const SupportSession = require("../../models/SupportSession");

const router = express.Router();

// Get all unresolved user sessions (for admin)
router.get("/sessions", async (req, res) => {
  try {
    const sessions = await SupportSession.find({ isResolved: false }).sort({ updatedAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get chat history for a session
router.get("/sessions/:sessionId/messages", async (req, res) => {
  try {
    const messages = await ChatMessage.find({ sessionId: req.params.sessionId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Mark session as resolved
router.patch("/sessions/:sessionId", async (req, res) => {
  try {
    const session = await SupportSession.findByIdAndUpdate(
      req.params.sessionId,
      { isResolved: true },
      { new: true }
    );
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// Create a session (do not needed, created automatically when user join)
module.exports = router;
