import mongoose from "mongoose";

const ratingEntrySchema = new mongoose.Schema(
  {
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    driverName: { type: String, trim: true, default: "" },
    averageRating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, min: 0, default: 0 },
  },
  { _id: false }
);

const reviewEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    rating: { type: Number, min: 0, max: 5, required: true },
    comment: { type: String, trim: true, maxlength: 500, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    subject: { type: String, trim: true, required: true, minlength: 3, maxlength: 120 },
    message: { type: String, trim: true, required: true, minlength: 5, maxlength: 1000 },
    status: { type: String, enum: ["open", "in-progress", "resolved", "rejected"], default: "open" },
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const paymentEntrySchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    amount: { type: Number, min: 0, required: true },
    currency: { type: String, trim: true, default: "USD" },
    status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    paidAt: { type: Date, default: null },
  },
  { _id: false }
);

const adminContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true, default: "default" },
    ratings: {
      driverRatings: { type: [ratingEntrySchema], default: [] },
      recentReviews: { type: [reviewEntrySchema], default: [] },
      routePerformance: { type: [mongoose.Schema.Types.Mixed], default: [] },
    },
    reports: { type: mongoose.Schema.Types.Mixed, default: {} },
    complaints: { type: [complaintSchema], default: [] },
    payments: { type: [paymentEntrySchema], default: [] },
    audit: { type: mongoose.Schema.Types.Mixed, default: {} },
    communication: { type: mongoose.Schema.Types.Mixed, default: {} },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("AdminContent", adminContentSchema);
