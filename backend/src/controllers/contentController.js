import AdminContent from "../models/AdminContent.js";

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
