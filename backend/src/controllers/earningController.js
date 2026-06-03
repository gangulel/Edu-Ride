import Earning from "../models/Earning.js";
import Payment from "../models/Payment.js";

// GET /api/earnings — driver's earnings rollup.
export const getEarningsSummary = async (req, res) => {
  if (req.user.role !== "driver" && req.user.role !== "admin") {
    return res.status(403).json({ error: "Driver only" });
  }

  const driverId = req.user.role === "admin" && req.query.driver ? req.query.driver : req.user._id;
  const now = new Date();
  const thisMonthKey = now.toISOString().slice(0, 7);
  const lastMonth = new Date(now);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const lastMonthKey = lastMonth.toISOString().slice(0, 7);

  const [thisMonthRow, lastMonthRow, history, pendingPayoutAgg] = await Promise.all([
    Earning.findOne({ driver: driverId, month: thisMonthKey }),
    Earning.findOne({ driver: driverId, month: lastMonthKey }),
    Earning.find({ driver: driverId }).sort({ month: -1 }).limit(12),
    Earning.aggregate([
      { $match: { driver: driverId, payoutStatus: "pending" } },
      { $group: { _id: null, total: { $sum: "$netAmount" } } },
    ]),
  ]);

  const totalAgg = await Payment.aggregate([
    { $match: { driver: driverId, status: "completed" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  res.json({
    earnings: {
      driverId,
      thisMonth: thisMonthRow?.netAmount || 0,
      lastMonth: lastMonthRow?.netAmount || 0,
      pendingPayout: pendingPayoutAgg[0]?.total || 0,
      totalEarned: totalAgg[0]?.total || 0,
      history,
    },
  });
};
