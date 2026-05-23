import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { notify } from "../services/notificationService.js";

// Maps the raw conversation document into a frontend-friendly shape that
// includes the OTHER participant (the "counterpart") and the unread count
// for the current viewer — saving the mobile client a join.
function shapeConversation(conv, viewerId) {
  const viewer = String(viewerId);
  const counterpartId = conv.participants
    .map((p) => (p._id ? p : { _id: p }))
    .find((p) => String(p._id) !== viewer);

  const unreadMap = conv.unreadCounts || {};
  const unreadCount = Number(unreadMap[viewer] || 0);

  return {
    id: conv._id,
    counterpart: counterpartId
      ? {
          id: counterpartId._id,
          name: counterpartId.fullName || "User",
          initials: counterpartId.fullName
            ? counterpartId.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
            : "?",
          role: counterpartId.role,
          profilePhoto: counterpartId.profilePhoto || null,
        }
      : null,
    lastMessage: conv.lastMessage,
    lastMessageAt: conv.lastMessageAt,
    unreadCount,
    updatedAt: conv.updatedAt,
  };
}

// GET /api/conversations
export const listConversations = async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .sort({ lastMessageAt: -1 })
    .populate("participants", "fullName role profilePhoto");
  res.json({
    conversations: conversations.map((c) => shapeConversation(c, req.user._id)),
  });
};

// POST /api/conversations — find-or-create with another user.
export const startConversation = async (req, res) => {
  const { counterpart } = req.body;
  if (String(counterpart) === String(req.user._id)) {
    return res.status(400).json({ error: "Cannot start a conversation with yourself." });
  }
  const otherUser = await User.findById(counterpart);
  if (!otherUser) return res.status(404).json({ error: "Other user not found." });

  const conv = await Conversation.findOrCreate(req.user._id, counterpart);
  await conv.populate("participants", "fullName role profilePhoto");
  res.json({ conversation: shapeConversation(conv, req.user._id) });
};

// GET /api/conversations/:id/messages
export const listMessages = async (req, res) => {
  const conv = await Conversation.findById(req.params.id);
  if (!conv) return res.status(404).json({ error: "Conversation not found" });
  if (!conv.participants.some((p) => p.equals(req.user._id))) {
    return res.status(403).json({ error: "Not a participant in this conversation." });
  }

  const messages = await Message.find({ conversation: conv._id }).sort({ createdAt: 1 }).limit(200);

  // Mark all messages addressed to viewer as read.
  const viewer = String(req.user._id);
  if (conv.unreadCounts && conv.unreadCounts[viewer]) {
    conv.unreadCounts[viewer] = 0;
    conv.markModified("unreadCounts");
    await conv.save();
  }
  await Message.updateMany(
    { conversation: conv._id, readBy: { $ne: req.user._id } },
    { $addToSet: { readBy: req.user._id } }
  );

  res.json({ messages });
};

// POST /api/conversations/:id/messages
export const sendMessage = async (req, res) => {
  const conv = await Conversation.findById(req.params.id);
  if (!conv) return res.status(404).json({ error: "Conversation not found" });
  if (!conv.participants.some((p) => p.equals(req.user._id))) {
    return res.status(403).json({ error: "Not a participant in this conversation." });
  }

  const message = await Message.create({
    conversation: conv._id,
    sender: req.user._id,
    text: req.body.text,
    readBy: [req.user._id],
  });

  // Update conversation snapshot + bump unread count for the OTHER participant.
  conv.lastMessage = req.body.text;
  conv.lastMessageAt = message.createdAt;
  conv.lastSender = req.user._id;

  const sender = String(req.user._id);
  const updated = { ...(conv.unreadCounts || {}) };
  conv.participants.forEach((p) => {
    const key = String(p);
    if (key !== sender) {
      updated[key] = (Number(updated[key]) || 0) + 1;
    }
  });
  conv.unreadCounts = updated;
  conv.markModified("unreadCounts");
  await conv.save();

  // Notify the recipient(s).
  conv.participants
    .filter((p) => String(p) !== sender)
    .forEach((recipient) => {
      notify(recipient, {
        type: "message",
        title: "New message",
        body: req.body.text.slice(0, 120),
        data: { conversationId: conv._id },
      }).catch(() => {});
    });

  res.status(201).json({ message });
};
