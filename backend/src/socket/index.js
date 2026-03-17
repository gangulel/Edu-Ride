import { Server } from "socket.io";
import admin from "../config/firebase.js";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  // Authenticate socket connections via Firebase token
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));
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

    // Driver joins their own room for broadcasting location
    socket.on("driver:join", (driverId) => {
      socket.join(`driver:${driverId}`);
    });

    // Parent subscribes to a driver's location updates
    socket.on("parent:track", (driverId) => {
      socket.join(`driver:${driverId}`);
    });

    // Parent unsubscribes from a driver's location
    socket.on("parent:untrack", (driverId) => {
      socket.leave(`driver:${driverId}`);
    });

    // Driver sends GPS location update
    socket.on("location:update", (data) => {
      // data: { latitude, longitude, heading, speed, tripId }
      io.to(`driver:${socket.userId}`).emit("location:updated", {
        driverId: socket.userId,
        ...data,
        timestamp: new Date(),
      });
    });

    // Trip student status update broadcast
    socket.on("trip:studentUpdate", (data) => {
      // data: { tripId, studentId, status }
      io.to(`driver:${socket.userId}`).emit("trip:studentUpdated", data);
    });

    // Trip started/completed broadcast
    socket.on("trip:statusUpdate", (data) => {
      // data: { tripId, status }
      io.to(`driver:${socket.userId}`).emit("trip:statusUpdated", data);
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.userId}`);
    });
  });

  return io;
};
