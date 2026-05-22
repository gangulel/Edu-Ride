import dotenv from "dotenv";
import mongoose from "mongoose";

// Load env vars from backend/.env when run from backend directory.
dotenv.config();

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error("MONGO_URL is missing. Add it to backend/.env and retry.");
  process.exit(1);
}

const run = async () => {
  try {
    const conn = await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 10000,
    });

    const ping = await mongoose.connection.db.admin().ping();

    console.log("MongoDB connection successful.");
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    console.log(`Ping ok: ${ping.ok === 1 ? "yes" : "no"}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("MongoDB connection failed.");
    console.error(error.message);
    process.exit(1);
  }
};

run();
