import { Router } from "express";
import { startTrip, getActiveTrip, updateStudentStatus, completeTrip, getTripHistory } from "../controllers/tripController.js";
import { requireRole } from "../middleware/roleCheck.js";

const router = Router();

router.post("/", requireRole("driver"), startTrip);
router.get("/active", getActiveTrip);
router.put("/:id/student/:studentId", requireRole("driver"), updateStudentStatus);
router.put("/:id/complete", requireRole("driver"), completeTrip);
router.get("/history", getTripHistory);

export default router;
