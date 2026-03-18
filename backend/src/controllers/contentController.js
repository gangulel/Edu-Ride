import AdminContent from "../models/AdminContent.js";
import User from "../models/User.js";

// GET /api/public/admin-content — Public: admin dashboard content data
export const getAdminContent = async (_req, res) => {
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
    audit: content.audit || { loginHistory: [], adminActions: [], suspiciousActivity: [] },
    communication: content.communication || { notifications: [], templates: [] },
    settings: content.settings || { features: [] },
    content: content.content || { termsContent: "", privacyContent: "", faqs: [] },
  });
};

// GET /api/public/users — Public: read-only users list for admin UI fallback
export const getPublicUsers = async (req, res) => {
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
    filter.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { school: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parsedPage - 1) * parsedLimit;
  const [users, total] = await Promise.all([
    User.find(filter)
      .select("fullName email phone role status school rating reviewCount totalTrips createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit),
    User.countDocuments(filter),
  ]);

  res.json({
    users,
    pagination: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      pages: Math.ceil(total / parsedLimit),
    },
  });
};
