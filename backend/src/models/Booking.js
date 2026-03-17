import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    child: { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true },
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", default: null },

    pickupAddress: { type: String, required: true },
    dropoffAddress: { type: String, default: null },
    monthlyFee: { type: Number, required: true },
    startDate: { type: Date, required: true },
    specialInstructions: { type: String, default: "" },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "expired"],
      default: "pending",
    },
    rejectionReason: { type: String, default: null },
  },
  { timestamps: true }
);

bookingSchema.index({ status: 1 });

export default mongoose.model("Booking", bookingSchema);
