import { Router } from "express";
import {
  getDashboardStats,
  getUserStats,
  getAdminVehicles,
  updateAdminRouteStatus,
} from "../controllers/adminController.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/schemas.js";

const router = Router();

router.get("/dashboard", getDashboardStats);
router.get("/users/stats", getUserStats);
router.get("/vehicles", getAdminVehicles);
router.put("/routes/:id/status", validate({ params: idParamSchema }), updateAdminRouteStatus);

export default router;
