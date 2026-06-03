import Notification from "../models/Notification.js";
import { notify } from "../services/notificationService.js";

// GET /api/notifications
export const listNotifications = async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.type) filter.type = req.query.type;
  if (req.query.read === "true") filter.read = true;
  if (req.query.read === "false") filter.read = false;

  const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(200);
  const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });

  res.json({ notifications, unreadCount });
};

// PATCH /api/notifications/:id/read
export const markRead = async (req, res) => {
  const doc = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true, readAt: new Date() },
    { new: true }
  );
  if (!doc) return res.status(404).json({ error: "Notification not found" });
  res.json({ notification: doc });
};

// POST /api/notifications/read-all
export const markAllRead = async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, read: false },
    { read: true, readAt: new Date() }
  );
  res.json({ ok: true });
};

// DELETE /api/notifications/:id
export const removeNotification = async (req, res) => {
  await Notification.deleteOne({ _id: req.params.id, user: req.user._id });
  res.json({ ok: true });
};

// POST /api/notifications  — admin-only sender for broadcasts/tests.
export const createNotificationForUser = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only" });
  const doc = await notify(req.body.user, {
    type: req.body.type,
    title: req.body.title,
    body: req.body.body,
    data: req.body.data || {},
  });
  res.status(201).json({ notification: doc });
};
