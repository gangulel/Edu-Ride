import admin from "../config/firebase.js";
import User from "../models/User.js";
import { verifyAdminSessionToken } from "../lib/adminSessionToken.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split("Bearer ")[1];

  const adminSession = verifyAdminSessionToken(token);
  if (adminSession) {
    req.user = {
      _id: adminSession.id,
      email: adminSession.email,
      fullName: adminSession.fullName,
      role: "admin",
      status: "active",
      firebaseUid: "internal-admin",
      profilePhoto: null,
    };
    return next();
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.firebaseUser = decoded;

    const user = await User.findOne({ firebaseUid: decoded.uid });
    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
