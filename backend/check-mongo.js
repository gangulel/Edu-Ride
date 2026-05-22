import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "node:dns";
import path from "path";
import { fileURLToPath } from "url";

const PUBLIC_DNS_SERVERS = ["8.8.8.8", "1.1.1.1"];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always load backend/.env, no matter where command is run from.
dotenv.config({ path: path.join(__dirname, ".env") });

const uri = process.env.MONGO_URL;

if (!uri) {
  console.error("MONGO_URL not found in backend/.env");
  process.exit(1);
}

const maskMongoUri = (value) => {
  try {
    const parsed = new URL(value);
    if (parsed.username || parsed.password) {
      parsed.username = parsed.username ? "***" : "";
      parsed.password = parsed.password ? "***" : "";
    }
    return parsed.toString();
  } catch {
    return "<invalid-uri>";
  }
};

const printErrorDetails = (err) => {
  const msg = String(err?.message || "Unknown error");
  const name = String(err?.name || "UnknownError");
  const code = String(err?.code || "NO_CODE");

  console.error("Mongo connection FAILED");
  console.error(`Name: ${name}`);
  console.error(`Code: ${code}`);
  console.error(`Message: ${msg}`);

  if (code === "ENOTFOUND" || msg.includes("querySrv ENOTFOUND")) {
    console.error("Hint: DNS could not resolve your Atlas host.");
    console.error("Hint: Verify cluster hostname in MONGO_URL from Atlas > Connect.");
    return;
  }

  if (name === "MongoServerSelectionError" && msg.toLowerCase().includes("timed out")) {
    console.error("Hint: Timed out reaching MongoDB server.");
    console.error("Hint: Check internet, firewall, VPN, and Atlas IP access list.");
    return;
  }

  if (name === "MongoServerError" && (code === "18" || msg.toLowerCase().includes("authentication failed"))) {
    console.error("Hint: MongoDB authentication failed.");
    console.error("Hint: Re-check DB username/password and URL-encode special characters in password.");
    return;
  }

  if (msg.includes("Invalid scheme") || msg.includes("connection string") || code === "ERR_INVALID_URL") {
    console.error("Hint: Invalid Mongo connection string format.");
    console.error("Hint: URI must start with mongodb:// or mongodb+srv://");
    return;
  }

  if (msg.toLowerCase().includes("ssl") || msg.toLowerCase().includes("tls")) {
    console.error("Hint: TLS/SSL handshake problem.");
    console.error("Hint: Check network interception/proxy and Atlas TLS requirements.");
  }
};

const isSrvDnsError = (err) => {
  const msg = String(err?.message || "");
  return err?.code === "ENOTFOUND" || msg.includes("querySrv ENOTFOUND");
};

const connectAndPing = async () => {
  const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  const ping = await mongoose.connection.db.admin().ping();
  return { conn, ping };
};

try {
  const parsedUri = new URL(uri);
  if (!["mongodb:", "mongodb+srv:"].includes(parsedUri.protocol)) {
    throw new Error("Invalid connection string protocol. Use mongodb:// or mongodb+srv://");
  }

  console.log("Testing URI:", maskMongoUri(uri));

  let result;

  try {
    result = await connectAndPing();
  } catch (firstErr) {
    if (!isSrvDnsError(firstErr)) {
      throw firstErr;
    }

    console.warn("Primary DNS failed for MongoDB SRV lookup. Retrying with public DNS...");
    dns.setServers(PUBLIC_DNS_SERVERS);
    await mongoose.disconnect().catch(() => {});
    result = await connectAndPing();
    console.log("MongoDB DNS fallback in use (8.8.8.8, 1.1.1.1)");
  }

  const { conn, ping } = result;

  console.log("Mongo connection OK");
  console.log("Host:", conn.connection.host);
  console.log("DB:", conn.connection.name);
  console.log("Ping:", ping.ok === 1 ? "ok" : "failed");

  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  printErrorDetails(err);
  process.exit(1);
}
