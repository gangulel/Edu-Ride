import admin from "../config/firebase.js";
import User from "../models/User.js";

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
