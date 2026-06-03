// Centralized notification creation so other controllers (booking, payment,
// chat) can fire off in-app notifications with a single call. Persists the
// row, then broadcasts via Socket.IO when available so connected clients see
// the badge update immediately.
import Notification from "../models/Notification.js";

let ioRef = null;

// Wired up from socket/index.js so the service can broadcast without
// holding a circular dependency on the socket module.
export function registerSocketServer(io) {
  ioRef = io;
}

export async function notify(userId, payload) {
  const doc = await Notification.create({ user: userId, ...payload });
  if (ioRef) {
    ioRef.to(`user:${userId}`).emit("notification:new", doc);
  }
  return doc;
}

export async function notifyMany(userIds, payload) {
  const docs = await Notification.insertMany(
    userIds.map((uid) => ({ user: uid, ...payload }))
  );
  if (ioRef) {
    docs.forEach((doc) => {
      ioRef.to(`user:${doc.user}`).emit("notification:new", doc);
    });
  }
  return docs;
}
