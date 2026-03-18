import { apiRequest } from "./api";

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
