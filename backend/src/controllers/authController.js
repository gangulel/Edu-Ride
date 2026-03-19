import admin from "../config/firebase.js";
import bcrypt from "bcryptjs";
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

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

async function createMongoUserFromFirebase(firebaseUser, profile) {
  const normalizedEmail = normalizeEmail(profile.email || firebaseUser.email);

  return User.create({
    firebaseUid: firebaseUser.uid,
    email: normalizedEmail,
    fullName: profile.fullName,
    phone: profile.phone,
    role: profile.role,
    status: profile.role === "parent" ? "active" : "pending",
  });
}

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

  // Backward-compatible path for local development environments that still
  // use ADMIN_PANEL_PASSWORD. Production must use ADMIN_PANEL_PASSWORD_HASH.
  if (!isProduction && legacyPassword) {
    return {
      email,
      enabled: true,
      compare: async (password) => password === legacyPassword,
    };
  }

  return {
    email,
    enabled: false,
    compare: async () => false,
  };
}

// POST /api/auth/register
export const register = async (req, res) => {
  const { fullName, email, phone, password, role } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!fullName || !email || !phone || !password || !role) {
    return res.status(400).json({ error: "All fields are required: fullName, email, phone, password, role" });
  }

  if (!["parent", "driver"].includes(role)) {
    return res.status(400).json({ error: "Role must be 'parent' or 'driver'" });
  }

  let firebaseUser;
  let recoveredMissingMongoProfile = false;

  try {
    // Create user in Firebase Auth.
    firebaseUser = await admin.auth().createUser({
      email: normalizedEmail,
      password,
      displayName: fullName,
    });
  } catch (error) {
    if (error?.code !== "auth/email-already-exists") {
      throw error;
    }

    // Account already exists in Firebase. Repair missing Mongo profile if needed.
    firebaseUser = await admin.auth().getUserByEmail(normalizedEmail);
    const existingMongoUser = await User.findOne({
      $or: [{ firebaseUid: firebaseUser.uid }, { email: normalizedEmail }],
    });

    if (existingMongoUser) {
      if (existingMongoUser.firebaseUid !== firebaseUser.uid) {
        existingMongoUser.firebaseUid = firebaseUser.uid;
      }
      if (!existingMongoUser.fullName) {
        existingMongoUser.fullName = fullName;
      }
      if (!existingMongoUser.phone) {
        existingMongoUser.phone = phone;
      }
      await existingMongoUser.save();

      return res.status(200).json({
        message: "Account already exists. Continuing with existing profile.",
        alreadyRegistered: true,
        user: {
          id: existingMongoUser._id,
          firebaseUid: existingMongoUser.firebaseUid,
          email: existingMongoUser.email,
          fullName: existingMongoUser.fullName,
          phone: existingMongoUser.phone,
          role: existingMongoUser.role,
          status: existingMongoUser.status,
        },
      });
    }

    recoveredMissingMongoProfile = true;
  }

  let user = await User.findOne({ firebaseUid: firebaseUser.uid });

  if (!user) {
    user = await createMongoUserFromFirebase(firebaseUser, {
      fullName,
      email: normalizedEmail,
      phone,
      role,
    });
  }

  res.status(201).json({
    message: recoveredMissingMongoProfile
      ? "Registration recovered successfully"
      : "Registration successful",
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
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Verify user exists in Firebase
  const firebaseUser = await admin.auth().getUserByEmail(normalizedEmail);

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

  const internalAdmin = getInternalAdminCredentialConfig();
  const isInternalAdminCandidate = email === internalAdmin.email && internalAdmin.enabled;

  if (isInternalAdminCandidate && (await internalAdmin.compare(password))) {
    const existingAdmin = await User.findOne({ email: internalAdmin.email, role: "admin" });

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
        email: internalAdmin.email,
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
