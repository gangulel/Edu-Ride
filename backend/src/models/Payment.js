import mongoose from "mongoose";

// Transaction record. In Phase 1 the gateway is mocked: createPayment just
// inserts a "completed" row. The same shape will be populated by real
// webhook handlers once Stripe / PayHere are wired in Phase 2.
const paymentSchema = new mongoose.Schema(
  {
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription", default: null, index: true },
    paymentMethod: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentMethod", default: null },

    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "LKR" },

    method: { type: String, trim: true }, // human-readable e.g. "Visa •••• 4242"
    description: { type: String, trim: true, default: null },

    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "completed",
      index: true,
    },

    providerReference: { type: String, default: null }, // gateway txn id, when real
    failureReason: { type: String, default: null },
    refundedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

paymentSchema.index({ parent: 1, createdAt: -1 });
paymentSchema.index({ driver: 1, createdAt: -1 });

export default mongoose.model("Payment", paymentSchema);
