import { Router } from "express";
import { listRoutes, createRoute, getRouteById, updateRoute, deleteRoute, addStop, updateStop, removeStop } from "../controllers/routeController.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/roleCheck.js";

const router = Router();

// Public routes
router.get("/", listRoutes);
router.get("/:id", getRouteById);

// Protected routes — driver only
router.post("/", authenticate, requireRole("driver"), createRoute);
router.put("/:id", authenticate, requireRole("driver"), updateRoute);
router.delete("/:id", authenticate, deleteRoute);

// Stop management — driver only
router.post("/:id/stops", authenticate, requireRole("driver"), addStop);
router.put("/:id/stops/:stopId", authenticate, requireRole("driver"), updateStop);
router.delete("/:id/stops/:stopId", authenticate, requireRole("driver"), removeStop);

export default router;
