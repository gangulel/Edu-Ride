import User from "../models/User.js";

// GET /api/users — List users (admin)
export const listUsers = async (req, res) => {
  const { role, status, search, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-firebaseUid")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    User.countDocuments(filter),
  ]);

  res.json({
    users,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
};

// GET /api/users/:id — Get user by ID
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-firebaseUid");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Only admin or the user themselves can view
  if (req.user.role !== "admin" && req.user._id.toString() !== user._id.toString()) {
    return res.status(403).json({ error: "Insufficient permissions" });
  }

  res.json({ user });
};

// PUT /api/users/:id — Update own profile
export const updateUser = async (req, res) => {
  // Users can only update their own profile (admin can update anyone)
  if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
    return res.status(403).json({ error: "You can only update your own profile" });
  }

  const allowedFields = ["fullName", "phone", "profilePhoto"];
  // Driver-specific fields
  if (req.user.role === "driver" || req.user.role === "admin") {
    allowedFields.push("experience", "areasServed", "school", "monthlyFee", "isAC");
  }

  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).select("-firebaseUid");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ message: "Profile updated", user });
};

// PUT /api/users/:id/status — Admin: suspend/activate/verify
export const updateUserStatus = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  const { status, isVerified } = req.body;

  const updates = {};
  if (status && ["active", "pending", "suspended"].includes(status)) {
    updates.status = status;
  }
  if (isVerified !== undefined) {
    updates.isVerified = isVerified;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
  }).select("-firebaseUid");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ message: "User status updated", user });
};

// DELETE /api/users/:id — Admin: delete user
export const deleteUser = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Delete from Firebase Auth as well
  try {
    const admin = (await import("../config/firebase.js")).default;
    await admin.auth().deleteUser(user.firebaseUid);
  } catch (err) {
    console.error("Failed to delete Firebase user:", err.message);
  }

  await User.findByIdAndDelete(req.params.id);

  res.json({ message: "User deleted" });
};
