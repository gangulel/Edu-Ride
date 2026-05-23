import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/schemas.js";
import { createReviewSchema } from "../validators/additionalSchemas.js";
import {
  listReviewsForDriver,
  createReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Public listing for a driver — no auth required so service-detail screens
// can show reviews without forcing a login.
router.get("/driver/:driverId", listReviewsForDriver);

router.post("/", authenticate, validate({ body: createReviewSchema }), createReview);
router.delete("/:id", authenticate, validate({ params: idParamSchema }), deleteReview);

export default router;
