import mongoose from "mongoose";
import User from "../models/User.js";
import Route from "../models/Route.js";
import Vehicle from "../models/Vehicle.js";
import Booking from "../models/Booking.js";
import Trip from "../models/Trip.js";
import AuditLog from "../models/AuditLog.js";
import { escapeRegex, parsePagination } from "../utils/validation.js";

// Resolve a promise to a default value if it rejects so a single failing
// aggregation can't blow up the whole dashboard response.
const safe = (promise, fallback) =>
  Promise.resolve(promise).catch((err) => {
    console.error("Dashboard query failed:", err.message);
    return fallback;
  });

// GET /api/admin/dashboard — Dashboard aggregated stats
export const getDashboardStats = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: "Database is not connected yet. Please retry shortly.",
    });
  }

  const [
    totalParents,
    activeParents,
    pendingParents,
    totalDrivers,
    activeDrivers,
    pendingDrivers,
    suspendedDrivers,
    totalRoutes,
    activeRoutes,
    totalBookings,
    pendingBookings,
    acceptedBookings,
    totalTrips,
    completedTrips,
    activeTrips,
  ] = await Promise.all([
    safe(User.countDocuments({ role: "parent" }), 0),
    safe(User.countDocuments({ role: "parent", status: "active" }), 0),
    safe(User.countDocuments({ role: "parent", status: "pending" }), 0),
    safe(User.countDocuments({ role: "driver" }), 0),
    safe(User.countDocuments({ role: "driver", status: "active" }), 0),
    safe(User.countDocuments({ role: "driver", status: "pending" }), 0),
    safe(User.countDocuments({ role: "driver", status: "suspended" }), 0),
    safe(Route.countDocuments(), 0),
    safe(Route.countDocuments({ status: "active" }), 0),
    safe(Booking.countDocuments(), 0),
    safe(Booking.countDocuments({ status: "pending" }), 0),
    safe(Booking.countDocuments({ status: "accepted" }), 0),
    safe(Trip.countDocuments(), 0),
    safe(Trip.countDocuments({ status: "completed" }), 0),
    safe(Trip.countDocuments({ status: "in-progress" }), 0),
  ]);

  // Recent registrations (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentRegistrations = await safe(
    User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    0
  );

  // Pending driver verifications
  const pendingVerifications = await safe(
    User.find({
      role: "driver",
      status: "pending",
      isVerified: false,
    })
      .select("fullName email phone createdAt")
      .sort({ createdAt: -1 })
      .limit(10),
    []
  );

  res.json({
    stats: {
      users: {
        totalParents,
        activeParents,
        pendingParents,
        totalDrivers,
        activeDrivers,
        pendingDrivers,
        suspendedDrivers,
      },
      routes: {
        total: totalRoutes,
        active: activeRoutes,
      },
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        accepted: acceptedBookings,
      },
      trips: {
        total: totalTrips,
        completed: completedTrips,
        active: activeTrips,
      },
      recentRegistrations,
    },
    pendingVerifications,
  });
};

// GET /api/admin/vehicles — Admin: list all vehicles with driver info
export const getAdminVehicles = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database is not connected yet. Please retry shortly." });
  }

  const { search, vehicleType, page = 1, limit = 200 } = req.query;
  const pagination = parsePagination(page, Math.min(parseInt(limit, 10) || 200, 500));

  const filter = {};
  if (vehicleType && ["van", "bus", "mini-bus", "sedan"].includes(vehicleType)) {
    filter.vehicleType = vehicleType;
  }
  if (search) {
    const safe = escapeRegex(search);
    filter.$or = [
      { make: { $regex: safe, $options: "i" } },
      { model: { $regex: safe, $options: "i" } },
      { licensePlate: { $regex: safe, $options: "i" } },
    ];
  }

  const [vehicles, total] = await Promise.all([
    Vehicle.find(filter)
      .populate("driver", "fullName email phone status school")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    Vehicle.countDocuments(filter),
  ]);

  res.json({
    vehicles,
    pagination: { total, page: pagination.page, limit: pagination.limit, pages: Math.ceil(total / pagination.limit) },
  });
};

// PUT /api/admin/routes/:id/status — Admin: activate or deactivate a route
export const updateAdminRouteStatus = async (req, res) => {
  const { status } = req.body;
  if (!["active", "inactive"].includes(status)) {
    return res.status(400).json({ error: "status must be 'active' or 'inactive'" });
  }

  const route = await Route.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  )
    .populate("driver", "fullName")
    .populate("vehicle", "licensePlate");

  if (!route) {
    return res.status(404).json({ error: "Route not found" });
  }

  const { writeAuditLog } = await import("../lib/auditLog.js");
  writeAuditLog({
    type: "admin_action",
    admin: req.user?.email || req.user?.fullName || "admin",
    action: `Route ${status}`,
    target: route.name,
    details: `Route status set to "${status}"`,
    severity: "medium",
  });

  res.json({ message: `Route ${status}`, route });
};

// GET /api/admin/users/stats — User statistics breakdown
export const getUserStats = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: "Database is not connected yet. Please retry shortly.",
    });
  }

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [usersByRole, monthlyRegistrations, topDrivers] = await Promise.all([
    safe(
      User.aggregate([
        { $group: { _id: { role: "$role", status: "$status" }, count: { $sum: 1 } } },
        { $sort: { "_id.role": 1, "_id.status": 1 } },
      ]),
      []
    ),
    safe(
      User.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              role: "$role",
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      []
    ),
    safe(
      User.find({ role: "driver", status: "active" })
        .select("fullName rating reviewCount totalTrips school")
        .sort({ rating: -1 })
        .limit(10),
      []
    ),
  ]);

  res.json({
    usersByRole,
    monthlyRegistrations,
    topDrivers,
  });
};

// ── Month label helpers ───────────────────────────────────────────────────────

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function buildMonthLabels(count) {
  const now = new Date();
  const months = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() + 1, label: MONTH_NAMES[d.getMonth()] });
  }
  return months;
}

// GET /api/admin/analytics — Aggregated analytics for Reports & Analytics section
export const getAdminAnalytics = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database is not connected yet. Please retry shortly." });
  }

  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  const [userGrowthRaw, paymentTrendsRaw, activeRoutes, driverPerformanceRaw, tripStatusRaw] = await Promise.all([
    safe(
      User.aggregate([
        { $match: { createdAt: { $gte: twelveMonthsAgo } } },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, role: "$role" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      []
    ),
    safe(
      Booking.aggregate([
        { $match: { createdAt: { $gte: twelveMonthsAgo } } },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            totalBookings: { $sum: 1 },
            acceptedBookings: { $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] } },
            revenue: { $sum: { $cond: [{ $eq: ["$status", "accepted"] }, "$monthlyFee", 0] } },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      []
    ),
    safe(
      Route.find({ status: "active" })
        .populate("vehicle", "capacity")
        .select("name school studentCount")
        .limit(20),
      []
    ),
    safe(
      User.find({ role: "driver", status: "active", totalTrips: { $gt: 0 } })
        .select("fullName rating reviewCount totalTrips school")
        .sort({ totalTrips: -1, rating: -1 })
        .limit(20),
      []
    ),
    safe(
      Trip.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      []
    ),
  ]);

  const months = buildMonthLabels(12);

  // User growth by month
  const userGrowthByKey = new Map();
  for (const entry of userGrowthRaw) {
    const key = `${entry._id.year}-${entry._id.month}`;
    if (!userGrowthByKey.has(key)) userGrowthByKey.set(key, { parents: 0, drivers: 0 });
    const bucket = userGrowthByKey.get(key);
    if (entry._id.role === "parent") bucket.parents = entry.count;
    if (entry._id.role === "driver") bucket.drivers = entry.count;
  }
  const userGrowthData = months.map((m) => {
    const b = userGrowthByKey.get(`${m.year}-${m.month}`) || { parents: 0, drivers: 0 };
    return { month: m.label, parents: b.parents, drivers: b.drivers, total: b.parents + b.drivers };
  });

  // Payment trends by month
  const paymentByKey = new Map();
  for (const entry of paymentTrendsRaw) {
    paymentByKey.set(`${entry._id.year}-${entry._id.month}`, {
      revenue: entry.revenue,
      totalBookings: entry.totalBookings,
      acceptedBookings: entry.acceptedBookings,
    });
  }
  const paymentTrendData = months.map((m) => {
    const b = paymentByKey.get(`${m.year}-${m.month}`) || { revenue: 0, totalBookings: 0, acceptedBookings: 0 };
    return { month: m.label, ...b };
  });

  // Route utilization
  const routeUtilizationData = activeRoutes.map((route) => {
    const capacity = route.vehicle?.capacity || 20;
    const utilization = capacity > 0 ? Math.min(100, Math.round(((route.studentCount || 0) / capacity) * 100)) : 0;
    return {
      route: route.name.length > 14 ? route.name.slice(0, 14) + "…" : route.name,
      fullName: route.name,
      school: route.school,
      studentCount: route.studentCount || 0,
      capacity,
      utilization,
    };
  });

  // Driver performance
  const driverPerformanceData = driverPerformanceRaw.map((d) => ({
    driver: d.fullName,
    trips: d.totalTrips || 0,
    rating: d.rating || 0,
    reviews: d.reviewCount || 0,
    school: d.school || "—",
    onTime: d.rating ? Math.min(99, Math.round(d.rating * 19.6)) : 0,
  }));

  // Trip summary
  const tripStatusMap = {};
  for (const e of tripStatusRaw) tripStatusMap[e._id] = e.count;

  res.json({
    userGrowthData,
    paymentTrendData,
    routeUtilizationData,
    driverPerformanceData,
    tripSummary: {
      completed: tripStatusMap["completed"] || 0,
      active: tripStatusMap["in-progress"] || 0,
      notStarted: tripStatusMap["not-started"] || 0,
    },
  });
};

// GET /api/admin/ratings — Aggregated driver ratings and route performance
export const getAdminRatings = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database is not connected yet. Please retry shortly." });
  }

  const [drivers, routes] = await Promise.all([
    safe(
      User.find({ role: "driver", status: { $in: ["active", "pending"] } })
        .select("fullName rating reviewCount totalTrips school")
        .sort({ reviewCount: -1, rating: -1 })
        .limit(50),
      []
    ),
    safe(
      Route.find({ status: "active" })
        .populate("driver", "fullName rating")
        .select("name school studentCount")
        .limit(20),
      []
    ),
  ]);

  const driverRatings = drivers.map((d) => ({
    id: d._id.toString(),
    driver: d.fullName,
    route: d.school || "—",
    rating: d.rating || 0,
    reviews: d.reviewCount || 0,
    lowRated: d.reviewCount ? Math.max(0, Math.floor(d.reviewCount * Math.max(0, (3 - d.rating) / 5))) : 0,
    flagged: 0,
    avgMonth: d.rating ? d.rating.toFixed(1) : "0.0",
  }));

  const routePerformance = routes.map((r) => ({
    route: r.name.length > 12 ? r.name.slice(0, 12) + "…" : r.name,
    fullName: r.name,
    school: r.school,
    avgRating: r.driver?.rating || 0,
    students: r.studentCount || 0,
    driverName: r.driver?.fullName || "—",
  }));

  res.json({ driverRatings, routePerformance, recentReviews: [] });
};

// GET /api/admin/audit-logs — Paginated audit log entries
export const getAdminAuditLogs = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database is not connected yet. Please retry shortly." });
  }

  const limit = Math.min(parseInt(req.query.limit, 10) || 100, 500);

  const [loginHistory, adminActions, suspiciousActivity] = await Promise.all([
    safe(
      AuditLog.find({ type: "login" })
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean(),
      []
    ),
    safe(
      AuditLog.find({ type: "admin_action" })
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean(),
      []
    ),
    safe(
      AuditLog.find({ type: "suspicious" })
        .sort({ timestamp: -1 })
        .limit(50)
        .lean(),
      []
    ),
  ]);

  const fmt = (doc) => ({
    ...doc,
    id: doc._id?.toString() || String(Math.random()),
    timestamp: doc.timestamp ? new Date(doc.timestamp).toLocaleString() : "—",
  });

  res.json({
    loginHistory: loginHistory.map(fmt),
    adminActions: adminActions.map(fmt),
    suspiciousActivity: suspiciousActivity.map(fmt),
  });
};
