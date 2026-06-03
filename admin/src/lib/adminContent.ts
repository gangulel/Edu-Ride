import { apiRequest } from "./api";

// ── Existing admin-content types (complaints, communication, audit static) ──

export type RatingsSection = {
  driverRatings: Array<any>;
  recentReviews: Array<any>;
  routePerformance: Array<any>;
};

export type ReportsSection = {
  userGrowthData: Array<any>;
  routeUtilizationData: Array<any>;
  paymentTrendData: Array<any>;
  driverPerformanceData: Array<any>;
};

export type AuditSection = {
  loginHistory: Array<any>;
  adminActions: Array<any>;
  suspiciousActivity: Array<any>;
};

export type CommunicationSection = {
  notifications: Array<any>;
  templates: Array<any>;
};

export type ContentSection = {
  termsContent: string;
  privacyContent: string;
  faqs: Array<any>;
};

export type SettingsSection = {
  features: Array<any>;
};

export type AdminContentPayload = {
  ratings: RatingsSection;
  reports: ReportsSection;
  complaints: Array<any>;
  audit: AuditSection;
  communication: CommunicationSection;
  settings: SettingsSection;
  content: ContentSection;
};

export async function fetchAdminContent() {
  return apiRequest<AdminContentPayload>("/public/admin-content");
}

// ── New real-data aggregation types ──────────────────────────────────────────

export type AnalyticsMonthPoint = {
  month: string;
  parents: number;
  drivers: number;
  total: number;
};

export type PaymentTrendPoint = {
  month: string;
  revenue: number;
  totalBookings: number;
  acceptedBookings: number;
};

export type RouteUtilizationItem = {
  route: string;
  fullName: string;
  school: string;
  studentCount: number;
  capacity: number;
  utilization: number;
};

export type DriverPerformanceItem = {
  driver: string;
  trips: number;
  rating: number;
  reviews: number;
  school: string;
  onTime: number;
};

export type AdminAnalyticsPayload = {
  userGrowthData: AnalyticsMonthPoint[];
  paymentTrendData: PaymentTrendPoint[];
  routeUtilizationData: RouteUtilizationItem[];
  driverPerformanceData: DriverPerformanceItem[];
  tripSummary: { completed: number; active: number; notStarted: number };
};

export type DriverRatingItem = {
  id: string;
  driver: string;
  route: string;
  rating: number;
  reviews: number;
  lowRated: number;
  flagged: number;
  avgMonth: string;
};

export type RoutePerformanceItem = {
  route: string;
  fullName: string;
  school: string;
  avgRating: number;
  students: number;
  driverName: string;
};

export type AdminRatingsPayload = {
  driverRatings: DriverRatingItem[];
  routePerformance: RoutePerformanceItem[];
  recentReviews: Array<any>;
};

export type AuditLogsPayload = {
  loginHistory: Array<any>;
  adminActions: Array<any>;
  suspiciousActivity: Array<any>;
};

export async function fetchAdminAnalytics() {
  return apiRequest<AdminAnalyticsPayload>("/admin/analytics");
}

export async function fetchAdminRatings() {
  return apiRequest<AdminRatingsPayload>("/admin/ratings");
}

export async function fetchAdminAuditLogs(limit = 100) {
  return apiRequest<AuditLogsPayload>(`/admin/audit-logs?limit=${limit}`);
}
