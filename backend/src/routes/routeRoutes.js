import { Router } from "express";
import { listRoutes, createRoute, getRouteById, updateRoute, deleteRoute, addStop, updateStop, removeStop } from "../controllers/routeController.js";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/roleCheck.js";
import { validate } from "../middleware/validate.js";
import { createRouteSchema, idParamSchema, listRoutesQuerySchema, routeStopSchema, stopParamsSchema, updateRouteSchema, updateStopSchema } from "../validators/schemas.js";

const router = Router();

// Public routes
router.get("/", validate({ query: listRoutesQuerySchema }), listRoutes);
router.get("/:id", validate({ params: idParamSchema }), getRouteById);

// Protected routes — driver only
router.post("/", authenticate, requireRole("driver"), validate({ body: createRouteSchema }), createRoute);
router.put("/:id", authenticate, requireRole("driver"), validate({ params: idParamSchema, body: updateRouteSchema }), updateRoute);
router.delete("/:id", authenticate, validate({ params: idParamSchema }), deleteRoute);

// Stop management — driver only
router.post("/:id/stops", authenticate, requireRole("driver"), validate({ params: idParamSchema, body: routeStopSchema }), addStop);
router.put("/:id/stops/:stopId", authenticate, requireRole("driver"), validate({ params: stopParamsSchema, body: updateStopSchema }), updateStop);
router.delete("/:id/stops/:stopId", authenticate, requireRole("driver"), validate({ params: stopParamsSchema }), removeStop);

export default router;
