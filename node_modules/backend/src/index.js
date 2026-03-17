import express from "express";
import cors from "cors";
import { createServer } from "http";
import fs from "fs";
import net from "net";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

import { connectDB } from "./lib/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authenticate } from "./middleware/auth.js";
import { requireRole } from "./middleware/roleCheck.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import childRoutes from "./routes/childRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import { initSocket } from "./socket/index.js";

const app = express();
const server = createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const adminBuildPath = path.resolve(__dirname, "../../admin/build");

async function findAvailablePort(startPort, host = "::") {
  const isAvailable = (port) =>
    new Promise((resolve) => {
      const tester = net.createServer();

      tester.once("error", () => resolve(false));
      tester.once("listening", () => {
        tester.close(() => resolve(true));
      });

      tester.listen(port, host);
    });

  let port = Number(startPort);
  while (!(await isAvailable(port))) {
    port += 1;
  }

  return port;
}

// Middleware
app.use(cors());
app.use(express.json());

// Public routes
app.use("/api/auth", authRoutes);
app.use("/api/public", contentRoutes);

// Mixed auth routes (GET is public, mutations need auth — handled in route files)
app.use("/api/routes", routeRoutes);

// Protected routes
app.use("/api/users", authenticate, userRoutes);
app.use("/api/children", authenticate, requireRole("parent"), childRoutes);
app.use("/api/vehicles", authenticate, requireRole("driver"), vehicleRoutes);
app.use("/api/bookings", authenticate, bookingRoutes);
app.use("/api/trips", authenticate, tripRoutes);
app.use("/api/admin", authenticate, requireRole("admin"), adminRoutes);

if (fs.existsSync(adminBuildPath)) {
  app.use("/admin", express.static(adminBuildPath));
  app.get("/admin/*path", (_req, res) => {
    res.sendFile(path.join(adminBuildPath, "index.html"));
  });
}

// Error handler (must be last)
app.use(errorHandler);

// Socket.IO
initSocket(server);

const PORT = Number(process.env.PORT || 3000);

connectDB().then(() => {
  findAvailablePort(PORT).then((availablePort) => {
    if (availablePort !== PORT) {
      console.warn(
        `Port ${PORT} is in use. Starting server on available port ${availablePort}.`
      );
    }

    server.listen(availablePort, () => {
      console.log(`Server running on port ${availablePort}`);
    });
  });
});

export default app;
