import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Optional now — only set when the user came in via Firebase Auth (admin
    // panel today, social sign-in later). Mobile users created via custom JWT
    // register won't have a firebaseUid.
    firebaseUid: { type: String, unique: true, sparse: true, index: true },

    // Hashed password (bcrypt) for users authenticated by custom JWT.
    // Stored with `select: false` so it never leaks via accidental serialization.
    passwordHash: { type: String, default: null, select: false },

    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    role: { type: String, enum: ["parent", "driver", "admin"], required: true },
    status: { type: String, enum: ["active", "pending", "suspended"], default: "pending" },
    profilePhoto: { type: String, default: null },

    // Dual-role support: a single person who plays both parent and driver
    // can hold two linked accounts and toggle between them.
    availableRoles: {
      type: [{ type: String, enum: ["parent", "driver", "admin"] }],
      default: undefined,
    },
    linkedAccountId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    // Driver-specific fields
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    totalTrips: { type: Number, default: 0 },
    experience: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    areasServed: [{ type: String }],
    school: { type: String, default: null },
    monthlyFee: { type: Number, default: 0 },
    isAC: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.index({ role: 1, status: 1 });

// Compact, safe representation for API responses. Never includes passwordHash.
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    firebaseUid: this.firebaseUid,
    email: this.email,
    fullName: this.fullName,
    phone: this.phone,
    role: this.role,
    status: this.status,
    profilePhoto: this.profilePhoto,
    availableRoles: this.availableRoles,
    linkedAccountId: this.linkedAccountId,
    ...(this.role === "driver" && {
      rating: this.rating,
      reviewCount: this.reviewCount,
      totalTrips: this.totalTrips,
      isVerified: this.isVerified,
      experience: this.experience,
      areasServed: this.areasServed,
      school: this.school,
      monthlyFee: this.monthlyFee,
      isAC: this.isAC,
    }),
  };
};

export default mongoose.model("User", userSchema);
