import { Router } from "express";
import { startTrip, getActiveTrip, updateStudentStatus, completeTrip, getTripHistory } from "../controllers/tripController.js";
import { requireRole } from "../middleware/roleCheck.js";
import { validate } from "../middleware/validate.js";
import { completeTripSchema, idParamSchema, startTripSchema, tripHistoryQuerySchema, tripStudentParamsSchema, updateStudentStatusSchema } from "../validators/schemas.js";

const router = Router();

router.post("/", requireRole("driver"), validate({ body: startTripSchema }), startTrip);
router.get("/active", getActiveTrip);
router.put("/:id/student/:studentId", requireRole("driver"), validate({ params: tripStudentParamsSchema, body: updateStudentStatusSchema }), updateStudentStatus);
router.put("/:id/complete", requireRole("driver"), validate({ params: idParamSchema, body: completeTripSchema }), completeTrip);
router.get("/history", validate({ query: tripHistoryQuerySchema }), getTripHistory);

export default router;
