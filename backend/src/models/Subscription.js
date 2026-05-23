import mongoose from "mongoose";

// An active monthly arrangement between a parent's child and a driver.
// Created when a Booking is accepted; renews monthly via the recurring
// payment job (TODO Phase 2). For Phase 1 the renewal is recorded manually
// by writing a Payment doc against the subscription.
const subscriptionSchema = new mongoose.Schema(
  {
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    child: { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null },
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route", default: null },

    status: {
      type: String,
      enum: ["active", "paused", "cancelled", "expired"],
      default: "active",
      index: true,
    },

    monthlyFee: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "LKR" },

    pickupLocation: { type: String, required: true, trim: true },
    dropoffLocation: { type: String, required: true, trim: true },
    pickupTime: { type: String, default: null },
    dropTime: { type: String, default: null },

    startDate: { type: Date, required: true },
    nextBillingDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Computed field returning days remaining until the next billing cycle.
subscriptionSchema.virtual("daysRemaining").get(function () {
  if (!this.nextBillingDate) return null;
  const diff = this.nextBillingDate.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

subscriptionSchema.set("toJSON", { virtuals: true });
subscriptionSchema.set("toObject", { virtuals: true });

export default mongoose.model("Subscription", subscriptionSchema);
