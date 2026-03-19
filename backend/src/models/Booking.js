import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    child: { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true },
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", default: null },

    pickupAddress: { type: String, required: true, trim: true, minlength: 5, maxlength: 200 },
    dropoffAddress: { type: String, trim: true, maxlength: 200, default: null },
    monthlyFee: { type: Number, required: true, min: 1, max: 100000 },
    startDate: { type: Date, required: true },
    specialInstructions: { type: String, trim: true, maxlength: 500, default: "" },

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
bookingSchema.index(
  { parent: 1, driver: 1, child: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["pending", "accepted"] },
    },
  }
);

export default mongoose.model("Booking", bookingSchema);
