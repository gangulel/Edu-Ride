// Socket.IO entry point. Authenticates connections with EITHER a custom user
// JWT (mobile parent/driver) or a Firebase ID token (legacy/google sign-in).
// Joins a per-user room so the notification service can push targeted events
// like notification:new and message:new without scanning the whole socket
// pool.
import { Server } from "socket.io";
import admin from "../config/firebase.js";
import { verifyUserToken } from "../lib/userToken.js";
import { registerSocketServer } from "../services/notificationService.js";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  // Authenticate socket connections.
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));

    const userPayload = verifyUserToken(token);
    if (userPayload) {
      socket.userId = userPayload.sub;
      socket.userRole = userPayload.role;
      return next();
    }

    try {
      const decoded = await admin.auth().verifyIdToken(token);
      socket.userId = decoded.uid;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.userId}`);

    // Join a personal room so the server can push targeted notifications.
    socket.join(`user:${socket.userId}`);

    // Driver joins their own room for location/trip broadcasts.
    socket.on("driver:join", (driverId) => socket.join(`driver:${driverId}`));
    socket.on("parent:track", (driverId) => socket.join(`driver:${driverId}`));
    socket.on("parent:untrack", (driverId) => socket.leave(`driver:${driverId}`));

    socket.on("location:update", (data) => {
      io.to(`driver:${socket.userId}`).emit("location:updated", {
        driverId: socket.userId,
        ...data,
        timestamp: new Date(),
      });
    });

    socket.on("trip:studentUpdate", (data) => {
      io.to(`driver:${socket.userId}`).emit("trip:studentUpdated", data);
    });

    socket.on("trip:statusUpdate", (data) => {
      io.to(`driver:${socket.userId}`).emit("trip:statusUpdated", data);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.userId}`);
    });
  });

  // Expose the io instance to the notification service for cross-module pushes.
  registerSocketServer(io);

  return io;
};
