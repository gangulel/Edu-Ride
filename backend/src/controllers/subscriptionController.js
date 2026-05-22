import Subscription from "../models/Subscription.js";

// GET /api/subscriptions
// Parents see their own subscriptions, drivers see subscriptions where they
// are the driver, admins see all.
export const listSubscriptions = async (req, res) => {
  const filter = {};
  if (req.user.role === "parent") filter.parent = req.user._id;
  else if (req.user.role === "driver") filter.driver = req.user._id;
  if (req.query.status) filter.status = req.query.status;

  const subs = await Subscription.find(filter)
    .sort({ createdAt: -1 })
    .populate("driver", "fullName email phone profilePhoto rating reviewCount monthlyFee")
    .populate("child", "fullName grade school");
  res.json({ subscriptions: subs });
};

// GET /api/subscriptions/active — current active subscription for the parent.
export const getActiveSubscription = async (req, res) => {
  const sub = await Subscription.findOne({ parent: req.user._id, status: "active" })
    .populate("driver", "fullName email phone profilePhoto rating reviewCount monthlyFee")
    .populate("child", "fullName grade school");
  res.json({ subscription: sub });
};

// GET /api/subscriptions/:id
export const getSubscription = async (req, res) => {
  const sub = await Subscription.findById(req.params.id)
    .populate("driver", "fullName email phone profilePhoto rating reviewCount")
    .populate("child", "fullName grade school");
  if (!sub) return res.status(404).json({ error: "Subscription not found" });

  // Ownership check
  if (
    req.user.role !== "admin" &&
    !sub.parent.equals(req.user._id) &&
    !sub.driver._id.equals(req.user._id)
  ) {
    return res.status(403).json({ error: "Not authorized to view this subscription" });
  }

  res.json({ subscription: sub });
};

// PUT /api/subscriptions/:id — Limited mutations: pause/cancel, update times.
export const updateSubscription = async (req, res) => {
  const sub = await Subscription.findById(req.params.id);
  if (!sub) return res.status(404).json({ error: "Subscription not found" });

  if (
    req.user.role !== "admin" &&
    !sub.parent.equals(req.user._id) &&
    !sub.driver.equals(req.user._id)
  ) {
    return res.status(403).json({ error: "Not authorized" });
  }

  // Only the parent (or admin) can cancel a subscription outright.
  if (req.body.status === "cancelled" && req.user.role === "driver") {
    return res.status(403).json({ error: "Only the parent can cancel a subscription." });
  }

  Object.assign(sub, req.body);
  if (req.body.status === "cancelled") {
    sub.cancelledAt = new Date();
    sub.endDate = new Date();
  }
  await sub.save();
  res.json({ subscription: sub });
};
