// Mobile users (parent + driver) authenticate via bcrypt + custom JWT —
// see lib/userToken.js. The admin panel still supports the legacy Firebase
// flow + the internal admin password fallback used by the admin web app.

import bcrypt from "bcryptjs";
import admin from "../config/firebase.js";
import User from "../models/User.js";
import { createUserToken } from "../lib/userToken.js";
import { createAdminSessionToken } from "../lib/adminSessionToken.js";

const FIREBASE_AUTH_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword";

const FIREBASE_LOGIN_ERROR_MESSAGES = {
  EMAIL_NOT_FOUND: "Invalid email or password",
  INVALID_PASSWORD: "Invalid email or password",
  INVALID_LOGIN_CREDENTIALS: "Invalid email or password",
  USER_DISABLED: "This account has been disabled",
};

const DEFAULT_ADMIN_EMAIL = "admin@eduride.com";
const BCRYPT_ROUNDS = 10;

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function getInternalAdminCredentialConfig() {
  const email = process.env.ADMIN_PANEL_EMAIL || DEFAULT_ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PANEL_PASSWORD_HASH;
  const legacyPassword = process.env.ADMIN_PANEL_PASSWORD;
  const isProduction = process.env.NODE_ENV === "production";

  if (passwordHash) {
    return {
      email,
      enabled: true,
      compare: async (password) => bcrypt.compare(password, passwordHash),
    };
  }
  if (!isProduction && legacyPassword) {
    return {
      email,
      enabled: true,
      compare: async (password) => password === legacyPassword,
    };
  }
  return { email, enabled: false, compare: async () => false };
}

function extractFirebaseErrorCode(payload) {
  if (!payload || typeof payload !== "object" || !("error" in payload)) return null;
  const firebaseError = payload.error;
  if (!firebaseError || typeof firebaseError !== "object" || !("message" in firebaseError)) {
    return null;
  }
  const message = String(firebaseError.message || "");
  if (!message) return null;
  return message.split(" ")[0];
}

// POST /api/auth/register — Parent or driver self-registration.
// Stores a bcrypt hash and returns a custom JWT.
export const register = async (req, res) => {
  const { fullName, email, phone, password, role } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!["parent", "driver"].includes(role)) {
    return res.status(400).json({ error: "Role must be 'parent' or 'driver'" });
  }

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const user = await User.create({
    email: normalizedEmail,
    fullName,
    phone,
    role,
    passwordHash,
    status: role === "parent" ? "active" : "pending",
  });

  const token = createUserToken(user);

  res.status(201).json({
    message: "Registration successful",
    token,
    user: user.toPublicJSON(),
  });
};

// POST /api/auth/login — Email + password for parent/driver. Returns a JWT.
export const login = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");
  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  if (user.status === "suspended") {
    return res.status(403).json({ error: "This account has been suspended." });
  }

  const token = createUserToken(user);

  res.json({
    message: "Login successful",
    token,
    user: user.toPublicJSON(),
  });
};

// POST /api/auth/admin/login — Internal admin or Firebase admin fallback.
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const internalAdmin = getInternalAdminCredentialConfig();
  const isInternalAdminCandidate = email === internalAdmin.email && internalAdmin.enabled;

  if (isInternalAdminCandidate && (await internalAdmin.compare(password))) {
    let existingAdmin = null;
    try {
      existingAdmin = await User.findOne({ email: internalAdmin.email, role: "admin" })
        .maxTimeMS(2000)
        .exec();
    } catch (err) {
      console.warn("Admin profile lookup skipped:", err.message);
    }

    const internalAdminUser = existingAdmin
      ? existingAdmin.toPublicJSON()
      : {
          id: "fixed-admin",
          firebaseUid: "internal-admin",
          email: internalAdmin.email,
          fullName: process.env.ADMIN_PANEL_NAME || "Edu-Ride Admin",
          phone: "",
          role: "admin",
          status: "active",
          profilePhoto: null,
        };

    const token = createAdminSessionToken(internalAdminUser);
    return res.json({ message: "Admin login successful", token, user: internalAdminUser });
  }

  // Try matching against a normal Mongo admin account with bcrypt password.
  const dbAdmin = await User.findOne({ email: normalizeEmail(email), role: "admin" }).select(
    "+passwordHash"
  );
  if (dbAdmin?.passwordHash && (await bcrypt.compare(password, dbAdmin.passwordHash))) {
    if (dbAdmin.status !== "active") {
      return res.status(403).json({ error: "Admin account is not active", status: dbAdmin.status });
    }
    const token = createAdminSessionToken(dbAdmin.toPublicJSON());
    return res.json({ message: "Admin login successful", token, user: dbAdmin.toPublicJSON() });
  }

  // Last resort: Firebase admin sign-in.
  const webApiKey = process.env.FIREBASE_WEB_API_KEY;
  if (!webApiKey) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  let firebaseResponse;
  try {
    firebaseResponse = await fetch(`${FIREBASE_AUTH_URL}?key=${webApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
  } catch (err) {
    console.error("Firebase admin sign-in network error:", err.message);
    return res.status(502).json({ error: "Could not reach the authentication provider." });
  }

  let firebasePayload;
  try {
    firebasePayload = await firebaseResponse.json();
  } catch {
    firebasePayload = null;
  }
  if (!firebaseResponse.ok) {
    const errorCode = extractFirebaseErrorCode(firebasePayload);
    const errorMessage = (errorCode && FIREBASE_LOGIN_ERROR_MESSAGES[errorCode]) || "Unable to sign in";
    const statusCode = errorCode === "USER_DISABLED" ? 403 : 401;
    return res.status(statusCode).json({ error: errorMessage });
  }

  const idToken = firebasePayload?.idToken;
  if (!idToken) {
    return res.status(401).json({ error: "Invalid login response from authentication provider" });
  }

  const decoded = await admin.auth().verifyIdToken(idToken);
  const user = await User.findOne({ firebaseUid: decoded.uid });
  if (!user) return res.status(404).json({ error: "User not found in database" });
  if (user.role !== "admin") return res.status(403).json({ error: "Admin access only" });
  if (user.status !== "active") {
    return res.status(403).json({ error: "Admin account is not active", status: user.status });
  }

  res.json({
    message: "Admin login successful",
    token: idToken,
    user: user.toPublicJSON(),
  });
};

// POST /api/auth/google — Firebase Google sign-in (kept as Phase 2 path).
export const googleAuth = async (req, res) => {
  const { idToken, role } = req.body;
  if (!idToken) return res.status(400).json({ error: "ID token is required" });

  const decoded = await admin.auth().verifyIdToken(idToken);
  let user = await User.findOne({ firebaseUid: decoded.uid });

  if (!user) {
    const userRole = role || "parent";
    if (!["parent", "driver"].includes(userRole)) {
      return res.status(400).json({ error: "Role must be 'parent' or 'driver'" });
    }
    user = await User.create({
      firebaseUid: decoded.uid,
      email: decoded.email,
      fullName: decoded.name || decoded.email.split("@")[0],
      phone: decoded.phone_number || "",
      role: userRole,
      profilePhoto: decoded.picture || null,
      status: userRole === "parent" ? "active" : "pending",
    });
  }

  // Mint a backend JWT so the mobile client only deals with one token type
  // regardless of how the user signed in.
  const token = createUserToken(user);

  res.json({
    message: "Google authentication successful",
    token,
    user: user.toPublicJSON(),
  });
};

// POST /api/auth/forgot — Stub. Real email sending is Phase 2.
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const user = await User.findOne({ email: normalizeEmail(email) });
  // Always respond identically to prevent account enumeration.
  if (!user) {
    return res.json({
      message: "If an account exists for this email, a reset link will be sent.",
    });
  }

  // TODO Phase 2: integrate SendGrid/SES/Twilio. For now we just acknowledge.
  console.log(`[forgotPassword] reset requested for ${email}. Stub email sender.`);
  res.json({ message: "If an account exists for this email, a reset link will be sent." });
};

// POST /api/auth/switch-role — Switch the signed-in user to their linked
// account in the opposite role (dual-role parent/driver).
export const switchRole = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  const { targetRole } = req.body;

  if (!["parent", "driver"].includes(targetRole)) {
    return res.status(400).json({ error: "targetRole must be 'parent' or 'driver'" });
  }

  if (req.user.role === targetRole) {
    return res.json({
      message: "Already in target role",
      token: createUserToken(req.user),
      user: req.user.toPublicJSON ? req.user.toPublicJSON() : req.user,
    });
  }

  const roles = req.user.availableRoles || [];
  if (!roles.includes(targetRole)) {
    return res.status(403).json({ error: `This account does not have access to the ${targetRole} role.` });
  }

  if (!req.user.linkedAccountId) {
    return res.status(404).json({ error: "No linked account is configured for this user." });
  }

  const linked = await User.findOne({ _id: req.user.linkedAccountId, role: targetRole });
  if (!linked) {
    return res.status(404).json({ error: `No ${targetRole} account is linked to this user.` });
  }

  const token = createUserToken(linked);
  res.json({ message: "Role switched", token, user: linked.toPublicJSON() });
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  if (!req.user) return res.status(404).json({ error: "User profile not found" });
  const user = req.user.toPublicJSON ? req.user.toPublicJSON() : req.user;
  res.json({ user });
};
