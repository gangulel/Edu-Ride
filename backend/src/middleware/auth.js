// Accepts (in order):
//   1. A user JWT issued by lib/userToken — for parents and drivers.
//   2. An admin session token — for the admin web app.
//   3. A Firebase ID token — kept for Google sign-in / legacy callers.
//
// On success, req.user is set to the Mongoose document (for owners with
// passwordHash) or a plain object (for the internal admin without a row).

import admin from "../config/firebase.js";
import User from "../models/User.js";
import { verifyAdminSessionToken } from "../lib/adminSessionToken.js";
import { verifyUserToken } from "../lib/userToken.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split("Bearer ")[1];

  // 1. Custom user JWT (mobile parent/driver).
  const userPayload = verifyUserToken(token);
  if (userPayload) {
    try {
      const user = await User.findById(userPayload.sub);
      if (!user) return res.status(401).json({ error: "Account no longer exists." });
      if (user.status === "suspended") {
        return res.status(403).json({ error: "Account suspended." });
      }
      req.user = user;
      return next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token." });
    }
  }

  // 2. Admin session token.
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

  // 3. Firebase ID token (Google sign-in path; future-proof).
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.firebaseUser = decoded;
    const user = await User.findOne({ firebaseUid: decoded.uid });
    if (user) req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
