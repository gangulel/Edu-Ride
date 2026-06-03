import mongoose from "mongoose";

// In-app notifications. Delivered via Socket.IO when the client is connected,
// fetched via REST otherwise. Tied to a user; broadcast (admin) notifications
// fan out into one row per recipient at creation time.
const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    type: {
      type: String,
      enum: ["info", "ride", "payment", "message", "success", "warning", "system"],
      default: "info",
      index: true,
    },

    title: { type: String, required: true, trim: true, maxlength: 160 },
    body: { type: String, required: true, trim: true, maxlength: 1000 },

    read: { type: Boolean, default: false, index: true },
    readAt: { type: Date, default: null },

    // Optional deep-link payload — e.g. { bookingId, conversationId }.
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);
