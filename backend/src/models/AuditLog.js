import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["login", "admin_action", "suspicious"],
      required: true,
      index: true,
    },
    // Login log fields
    user: { type: String, default: "" },
    role: { type: String, default: "" },
    ip: { type: String, default: "" },
    location: { type: String, default: "" },
    action: { type: String, default: "" },
    status: { type: String, default: "success" },
    // Admin action fields
    admin: { type: String, default: "" },
    target: { type: String, default: "" },
    details: { type: String, default: "" },
    severity: { type: String, enum: ["low", "medium", "high"], default: "low" },
    // Suspicious activity fields
    description: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

auditLogSchema.index({ timestamp: -1 });

export default mongoose.model("AuditLog", auditLogSchema);
