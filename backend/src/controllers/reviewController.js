import Review from "../models/Review.js";
import User from "../models/User.js";

// GET /api/reviews/driver/:driverId  — public list of reviews for a driver.
export const listReviewsForDriver = async (req, res) => {
  const driver = await User.findById(req.params.driverId);
  if (!driver || driver.role !== "driver") {
    return res.status(404).json({ error: "Driver not found" });
  }

  const reviews = await Review.find({ driver: driver._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("parent", "fullName profilePhoto");

  res.json({
    reviews,
    summary: { rating: driver.rating, reviewCount: driver.reviewCount },
  });
};

// POST /api/reviews
export const createReview = async (req, res) => {
  if (req.user.role !== "parent") {
    return res.status(403).json({ error: "Only parents can submit reviews." });
  }

  if (req.body.driver === String(req.user._id)) {
    return res.status(400).json({ error: "You cannot review your own account." });
  }

  try {
    const review = await Review.create({
      ...req.body,
      parent: req.user._id,
    });
    res.status(201).json({ review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "You have already reviewed this booking." });
    }
    throw err;
  }
};

// DELETE /api/reviews/:id — author or admin only.
export const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ error: "Review not found" });

  if (req.user.role !== "admin" && !review.parent.equals(req.user._id)) {
    return res.status(403).json({ error: "Not authorized" });
  }

  await review.deleteOne();
  res.json({ ok: true });
};
