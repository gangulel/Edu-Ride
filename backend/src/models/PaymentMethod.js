import mongoose from "mongoose";

// Stored payment instrument for a parent. We never store full card numbers —
// only the last 4 and the brand. When a real gateway is wired up (Stripe,
// PayHere) the `providerToken` field holds the gateway's vaulted card id.
const paymentMethodSchema = new mongoose.Schema(
  {
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    brand: { type: String, enum: ["Visa", "Mastercard", "Amex", "Discover", "Other"], default: "Visa" },
    last4: { type: String, required: true, match: /^\d{4}$/ },
    expiryMonth: { type: Number, required: true, min: 1, max: 12 },
    expiryYear: { type: Number, required: true, min: 24, max: 99 },
    holder: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false },
    providerToken: { type: String, default: null }, // gateway-specific vault id
  },
  { timestamps: true }
);

// Only one default card per parent.
paymentMethodSchema.index({ parent: 1, isDefault: 1 });

export default mongoose.model("PaymentMethod", paymentMethodSchema);
