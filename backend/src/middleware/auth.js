import admin from "../config/firebase.js";
import User from "../models/User.js";
import { verifyAdminSessionToken } from "../lib/adminSessionToken.js";
import { verifyMobileSessionToken } from "../lib/mobileSessionToken.js";

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

  // Mobile session token (issued when FIREBASE_WEB_API_KEY is unavailable)
  const mobileSession = verifyMobileSessionToken(token);
  if (mobileSession) {
    const user = await User.findById(mobileSession.id);
    if (user) {
      req.user = user;
      return next();
    }
    return res.status(401).json({ error: "User account not found" });
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
