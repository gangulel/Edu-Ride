import mongoose from "mongoose";
import dns from "node:dns";

const PUBLIC_DNS_SERVERS = ["8.8.8.8", "1.1.1.1"];

// Fail fast (instead of buffering for 10s) when a query is issued while the
// connection is down. Combined with our errorHandler this turns into a clean
// 503 response instead of a request hanging then 500'ing.
mongoose.set("bufferCommands", false);

let connectionPromise = null;
let lastError = null;

const isSrvDnsError = (error) => {
  const message = String(error?.message || "");
  return (
    error?.code === "ENOTFOUND" ||
    error?.code === "EREFUSED" ||
    message.includes("querySrv ENOTFOUND") ||
    message.includes("querySrv EREFUSED")
  );
};

const connectOnce = async (mongoUrl) => {
  return mongoose.connect(mongoUrl, {
    serverSelectionTimeoutMS: 10000,
  });
};

const attemptConnect = async () => {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    const err = new Error("MONGO_URL is missing");
    lastError = err;
    throw err;
  }

  try {
    const conn = await connectOnce(mongoUrl);
    console.log(`Database connected: ${conn.connection.host}`);
    lastError = null;
    return conn;
  } catch (error) {
    if (isSrvDnsError(error)) {
      try {
        dns.setServers(PUBLIC_DNS_SERVERS);
        console.warn("Primary DNS failed for MongoDB SRV lookup. Retrying with public DNS...");
        await mongoose.disconnect().catch(() => {});
        const retryConn = await connectOnce(mongoUrl);
        console.log(`Database connected: ${retryConn.connection.host}`);
        console.log("MongoDB DNS fallback in use (8.8.8.8, 1.1.1.1)");
        lastError = null;
        return retryConn;
      } catch (retryError) {
        console.error("Database connection failed after DNS fallback:", retryError.message);
        lastError = retryError;
        throw retryError;
      }
    }

    console.error("Database connection failed:", error.message);
    lastError = error;
    throw error;
  }
};

export const connectDB = async () => {
  // Return an in-flight or completed connection promise so concurrent callers
  // don't trigger duplicate connection attempts. We do NOT exit the process
  // on failure — let the app start so requests can return clear errors and
  // the connection can recover on the next attempt.
  if (!connectionPromise) {
    connectionPromise = attemptConnect().catch((err) => {
      // Reset so a later call can retry instead of replaying the rejection.
      connectionPromise = null;
      throw err;
    });
  }
  return connectionPromise;
};

export const getDbStatus = () => {
  const state = mongoose.connection.readyState;
  // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const labels = ["disconnected", "connected", "connecting", "disconnecting"];
  return {
    state: labels[state] || "unknown",
    ready: state === 1,
    error: lastError ? lastError.message : null,
  };
};
