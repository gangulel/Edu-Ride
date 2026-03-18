import admin from "../config/firebase.js";
import User from "../models/User.js";
import { createAdminSessionToken } from "../lib/adminSessionToken.js";

const FIREBASE_AUTH_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword";

const FIREBASE_LOGIN_ERROR_MESSAGES = {
  EMAIL_NOT_FOUND: "Invalid email or password",
  INVALID_PASSWORD: "Invalid email or password",
  INVALID_LOGIN_CREDENTIALS: "Invalid email or password",
  USER_DISABLED: "This account has been disabled",
};

const DEFAULT_ADMIN_EMAIL = "admin@eduride.com";
const DEFAULT_ADMIN_PASSWORD = "Admin@123";

function extractFirebaseErrorCode(payload) {
  if (!payload || typeof payload !== "object" || !("error" in payload)) {
    return null;
  }

  const firebaseError = payload.error;
  if (!firebaseError || typeof firebaseError !== "object" || !("message" in firebaseError)) {
    return null;
  }

  const message = String(firebaseError.message || "");
  if (!message) {
    return null;
  }

  return message.split(" ")[0];
}

// POST /api/auth/register
export const register = async (req, res) => {
  const { fullName, email, phone, password, role } = req.body;

  if (!fullName || !email || !phone || !password || !role) {
    return res.status(400).json({ error: "All fields are required: fullName, email, phone, password, role" });
  }

  if (!["parent", "driver"].includes(role)) {
    return res.status(400).json({ error: "Role must be 'parent' or 'driver'" });
  }

  // Create user in Firebase Auth
  const firebaseUser = await admin.auth().createUser({
    email,
    password,
    displayName: fullName,
  });

  // Create user in MongoDB
  const user = await User.create({
    firebaseUid: firebaseUser.uid,
    email,
    fullName,
    phone,
    role,
    status: role === "parent" ? "active" : "pending", // Drivers need admin approval
  });

  res.status(201).json({
    message: "Registration successful",
    user: {
      id: user._id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      status: user.status,
    },
  });
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Verify user exists in Firebase
  const firebaseUser = await admin.auth().getUserByEmail(email);

  // Find user in MongoDB
  const user = await User.findOne({ firebaseUid: firebaseUser.uid });
  if (!user) {
    return res.status(404).json({ error: "User not found in database" });
  }

  res.json({
    message: "Login successful",
    user: {
      id: user._id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      profilePhoto: user.profilePhoto,
      ...(user.role === "driver" && {
        rating: user.rating,
        reviewCount: user.reviewCount,
        totalTrips: user.totalTrips,
        isVerified: user.isVerified,
      }),
    },
  });
};

// POST /api/auth/admin/login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const fixedAdminEmail = process.env.ADMIN_PANEL_EMAIL || DEFAULT_ADMIN_EMAIL;
  const fixedAdminPassword = process.env.ADMIN_PANEL_PASSWORD || DEFAULT_ADMIN_PASSWORD;

  if (email === fixedAdminEmail && password === fixedAdminPassword) {
    const existingAdmin = await User.findOne({ email: fixedAdminEmail, role: "admin" });

    const internalAdminUser = existingAdmin
      ? {
        id: existingAdmin._id,
        firebaseUid: existingAdmin.firebaseUid,
        email: existingAdmin.email,
        fullName: existingAdmin.fullName,
        phone: existingAdmin.phone,
        role: existingAdmin.role,
        status: existingAdmin.status,
        profilePhoto: existingAdmin.profilePhoto,
      }
      : {
        id: "fixed-admin",
        firebaseUid: "internal-admin",
        email: fixedAdminEmail,
        fullName: process.env.ADMIN_PANEL_NAME || "Edu-Ride Admin",
        phone: "",
        role: "admin",
        status: "active",
        profilePhoto: null,
      };

    const token = createAdminSessionToken(internalAdminUser);

    return res.json({
      message: "Admin login successful",
      token,
      user: internalAdminUser,
    });
  }

  const webApiKey = process.env.FIREBASE_WEB_API_KEY;
  if (!webApiKey) {
    return res.status(500).json({
      error: "Admin login is not configured. Missing FIREBASE_WEB_API_KEY.",
    });
  }

  const firebaseResponse = await fetch(`${FIREBASE_AUTH_URL}?key=${webApiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });

  const firebasePayload = await firebaseResponse.json();
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

  if (!user) {
    return res.status(404).json({ error: "User not found in database" });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ error: "Admin access only" });
  }

  if (user.status !== "active") {
    return res.status(403).json({
      error: "Admin account is not active",
      status: user.status,
    });
  }

  res.json({
    message: "Admin login successful",
    token: idToken,
    user: {
      id: user._id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      profilePhoto: user.profilePhoto,
    },
  });
};

// POST /api/auth/google
export const googleAuth = async (req, res) => {
  const { idToken, role } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "ID token is required" });
  }

  // Verify the Firebase ID token (mobile app signs in with Google via Firebase client SDK)
  const decoded = await admin.auth().verifyIdToken(idToken);

  // Check if user already exists in MongoDB
  let user = await User.findOne({ firebaseUid: decoded.uid });

  if (!user) {
    // First-time Google sign-in — create user in MongoDB
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

  res.json({
    message: "Google authentication successful",
    user: {
      id: user._id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
      status: user.status,
      profilePhoto: user.profilePhoto,
    },
  });
};

// POST /api/auth/forgot
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Generate password reset link via Firebase
  const resetLink = await admin.auth().generatePasswordResetLink(email);

  // In production, send this link via an email service (SendGrid, etc.)
  // For now, return it in the response for development
  res.json({
    message: "Password reset link generated",
    resetLink, // Remove in production
  });
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  if (!req.user) {
    return res.status(404).json({ error: "User profile not found" });
  }

  res.json({ user: req.user });
};
