import mongoose from "mongoose";

// 1-to-1 conversation between a parent and a driver. Snapshots the last
// message + unread counts so the messages list renders without a join on
// every load.
const conversationSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    lastMessage: { type: String, default: "", trim: true },
    lastMessageAt: { type: Date, default: null, index: true },
    lastSender: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    // Maps userId -> unread count for that user in this conversation.
    // Using a Mixed type because mongoose Map serialization is awkward; the
    // controller handles JSON shaping.
    unreadCounts: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1 });

// Find (or create) the unique conversation between two users.
conversationSchema.statics.findOrCreate = async function (userA, userB) {
  const a = userA.toString();
  const b = userB.toString();
  let conv = await this.findOne({ participants: { $all: [a, b] } });
  if (!conv) {
    conv = await this.create({
      participants: [a, b],
      unreadCounts: { [a]: 0, [b]: 0 },
    });
  }
  return conv;
};

export default mongoose.model("Conversation", conversationSchema);
