import mongoose from "mongoose";

// Parent → driver review. Triggers an aggregate update on the driver's
// User document (rating + reviewCount) via the post-save hook below.
const reviewSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subscription: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription", default: null },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null },

    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 1000, default: "" },
  },
  { timestamps: true }
);

// One review per booking per parent — prevents brigading.
reviewSchema.index({ booking: 1, parent: 1 }, { unique: true, sparse: true });

// After a review is saved, recompute the driver's rating + count from scratch
// so the driver profile always reflects the truth.
reviewSchema.post("save", async function (doc) {
  const Review = mongoose.model("Review");
  const User = mongoose.model("User");

  const stats = await Review.aggregate([
    { $match: { driver: doc.driver } },
    {
      $group: {
        _id: "$driver",
        rating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const s = stats[0];
  if (s) {
    await User.findByIdAndUpdate(doc.driver, {
      rating: Math.round(s.rating * 10) / 10,
      reviewCount: s.count,
    });
  }
});

export default mongoose.model("Review", reviewSchema);
