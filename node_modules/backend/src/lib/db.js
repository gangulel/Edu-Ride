import mongoose from "mongoose";
import dns from "node:dns";

const PUBLIC_DNS_SERVERS = ["8.8.8.8", "1.1.1.1"];

const isSrvDnsError = (error) => {
  const message = String(error?.message || "");
  return error?.code === "ENOTFOUND" || message.includes("querySrv ENOTFOUND");
};

const connectOnce = async (mongoUrl) => {
  return mongoose.connect(mongoUrl, {
    serverSelectionTimeoutMS: 10000,
  });
};

export const connectDB = async () => {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
        console.log("Error connecting to database: MONGO_URL is missing");
        process.exit(1);
    }

    try{
        const conn= await connectOnce(mongoUrl);
        console.log(`Database connected: ${conn.connection.host}`);
        return conn;
    }catch (error){
        if (isSrvDnsError(error)) {
            try {
                dns.setServers(PUBLIC_DNS_SERVERS);
                console.log("Primary DNS failed for MongoDB SRV lookup. Retrying with public DNS...");
                await mongoose.disconnect().catch(() => {});
                const retryConn = await connectOnce(mongoUrl);
                console.log(`Database connected: ${retryConn.connection.host}`);
                console.log("MongoDB DNS fallback in use (8.8.8.8, 1.1.1.1)");
                return retryConn;
            } catch (retryError) {
                console.log("Error connecting to database after DNS fallback:", retryError.message);
                process.exit(1);
            }
        }

        console.log("Error connecting to database:", error.message);
        process.exit(1);
    }
}