import { Router } from "express";
import {
  getDashboardStats,
  getUserStats,
  getAdminVehicles,
  updateAdminRouteStatus,
  getAdminAnalytics,
  getAdminRatings,
  getAdminAuditLogs,
} from "../controllers/adminController.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/schemas.js";

const router = Router();

router.get("/dashboard", getDashboardStats);
router.get("/users/stats", getUserStats);
router.get("/vehicles", getAdminVehicles);
router.get("/analytics", getAdminAnalytics);
router.get("/ratings", getAdminRatings);
router.get("/audit-logs", getAdminAuditLogs);
router.put("/routes/:id/status", validate({ params: idParamSchema }), updateAdminRouteStatus);

export default router;
