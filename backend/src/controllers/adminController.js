import mongoose from "mongoose";
import User from "../models/User.js";
import Route from "../models/Route.js";
import Vehicle from "../models/Vehicle.js";
import Booking from "../models/Booking.js";
import Trip from "../models/Trip.js";
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
