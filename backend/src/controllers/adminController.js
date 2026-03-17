import User from "../models/User.js";
import Route from "../models/Route.js";
import Booking from "../models/Booking.js";
import Trip from "../models/Trip.js";

// GET /api/admin/dashboard — Dashboard aggregated stats
export const getDashboardStats = async (req, res) => {
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
    User.countDocuments({ role: "parent" }),
    User.countDocuments({ role: "parent", status: "active" }),
    User.countDocuments({ role: "parent", status: "pending" }),
    User.countDocuments({ role: "driver" }),
    User.countDocuments({ role: "driver", status: "active" }),
    User.countDocuments({ role: "driver", status: "pending" }),
    User.countDocuments({ role: "driver", status: "suspended" }),
    Route.countDocuments(),
    Route.countDocuments({ status: "active" }),
    Booking.countDocuments(),
    Booking.countDocuments({ status: "pending" }),
    Booking.countDocuments({ status: "accepted" }),
    Trip.countDocuments(),
    Trip.countDocuments({ status: "completed" }),
    Trip.countDocuments({ status: "in-progress" }),
  ]);

  // Recent registrations (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentRegistrations = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  // Pending driver verifications
  const pendingVerifications = await User.find({
    role: "driver",
    status: "pending",
    isVerified: false,
  })
    .select("fullName email phone createdAt")
    .sort({ createdAt: -1 })
    .limit(10);

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

// GET /api/admin/users/stats — User statistics breakdown
export const getUserStats = async (req, res) => {
  const usersByRole = await User.aggregate([
    { $group: { _id: { role: "$role", status: "$status" }, count: { $sum: 1 } } },
    { $sort: { "_id.role": 1, "_id.status": 1 } },
  ]);

  // Monthly registration trend (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRegistrations = await User.aggregate([
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
  ]);

  // Top-rated drivers
  const topDrivers = await User.find({ role: "driver", status: "active" })
    .select("fullName rating reviewCount totalTrips school")
    .sort({ rating: -1 })
    .limit(10);

  res.json({
    usersByRole,
    monthlyRegistrations,
    topDrivers,
  });
};
