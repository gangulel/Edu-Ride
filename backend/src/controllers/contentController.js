import mongoose from "mongoose";
import AdminContent from "../models/AdminContent.js";
import User from "../models/User.js";
import Child from "../models/Child.js";
import { escapeRegex } from "../utils/validation.js";

// GET /api/public/admin-content — Public: admin dashboard content data
export const getAdminContent = async (_req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database is not connected yet. Please retry shortly." });
  }

  try {
    const content = await AdminContent.findOne({ key: "default" }).lean();

    if (!content) {
      return res.json({
        ratings: { driverRatings: [], recentReviews: [], routePerformance: [] },
        reports: {
          userGrowthData: [],
          routeUtilizationData: [],
          paymentTrendData: [],
          driverPerformanceData: [],
        },
        complaints: [],
        payments: [],
        audit: { loginHistory: [], adminActions: [], suspiciousActivity: [] },
        communication: { notifications: [], templates: [] },
        settings: { features: [] },
        content: { termsContent: "", privacyContent: "", faqs: [] },
      });
    }

    res.json({
      ratings: content.ratings || { driverRatings: [], recentReviews: [], routePerformance: [] },
      reports: content.reports || {
        userGrowthData: [],
        routeUtilizationData: [],
        paymentTrendData: [],
        driverPerformanceData: [],
      },
      complaints: content.complaints || [],
      payments: content.payments || [],
      audit: content.audit || { loginHistory: [], adminActions: [], suspiciousActivity: [] },
      communication: content.communication || { notifications: [], templates: [] },
      settings: content.settings || { features: [] },
      content: content.content || { termsContent: "", privacyContent: "", faqs: [] },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/public/users — Public: read-only users list for admin UI fallback
export const getPublicUsers = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database is not connected yet. Please retry shortly." });
  }

  try {
    const { role, status, search, page = 1, limit = 100 } = req.query;

    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 200);
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);

    const filter = {};
    if (role && ["parent", "driver", "admin"].includes(role)) {
      filter.role = role;
    }
    if (status && ["active", "pending", "suspended"].includes(status)) {
      filter.status = status;
    }
    if (search) {
      const safeSearch = escapeRegex(search);
      filter.$or = [
        { fullName: { $regex: safeSearch, $options: "i" } },
        { email: { $regex: safeSearch, $options: "i" } },
        { phone: { $regex: safeSearch, $options: "i" } },
        { school: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const skip = (parsedPage - 1) * parsedLimit;
    const [rawUsers, total] = await Promise.all([
      User.find(filter)
        .select("fullName email phone role status school rating reviewCount totalTrips createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parsedLimit),
      User.countDocuments(filter),
    ]);

    let users = rawUsers.map((u) => u.toObject());
    const parentIds = users.filter((u) => u.role === "parent").map((u) => u._id);
    if (parentIds.length > 0) {
      const childCounts = await Child.aggregate([
        { $match: { parent: { $in: parentIds } } },
        { $group: { _id: "$parent", count: { $sum: 1 } } },
      ]);
      const countMap = new Map(childCounts.map((c) => [c._id.toString(), c.count]));
      users = users.map((u) =>
        u.role === "parent" ? { ...u, childrenCount: countMap.get(u._id.toString()) ?? 0 } : u
      );
    }

    res.json({
      users,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        pages: Math.ceil(total / parsedLimit),
      },
    });
  } catch (err) {
    next(err);
  }
};
