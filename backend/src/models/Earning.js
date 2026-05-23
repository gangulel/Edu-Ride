import mongoose from "mongoose";

// Monthly earnings rollup for a driver. Phase 1 inserts/updates rows when
// subscription payments succeed. Phase 2 a scheduled job will close out the
// previous month and create a fresh row for the next.
const earningSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    // YYYY-MM key — e.g. "2026-05". One row per driver per month.
    month: { type: String, required: true, match: /^\d{4}-\d{2}$/ },

    grossAmount: { type: Number, default: 0, min: 0 },
    commission: { type: Number, default: 0, min: 0 },
    netAmount: { type: Number, default: 0, min: 0 },
    rideCount: { type: Number, default: 0, min: 0 },
    studentsServed: { type: Number, default: 0, min: 0 },

    payoutStatus: {
      type: String,
      enum: ["pending", "processing", "paid", "failed"],
      default: "pending",
    },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

earningSchema.index({ driver: 1, month: 1 }, { unique: true });

export default mongoose.model("Earning", earningSchema);
