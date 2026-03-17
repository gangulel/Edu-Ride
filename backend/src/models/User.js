import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    role: { type: String, enum: ["parent", "driver", "admin"], required: true },
    status: { type: String, enum: ["active", "pending", "suspended"], default: "pending" },
    profilePhoto: { type: String, default: null },

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

export default mongoose.model("User", userSchema);
