import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/schemas.js";
import { updateSubscriptionSchema } from "../validators/additionalSchemas.js";
import {
  listSubscriptions,
  getActiveSubscription,
  getSubscription,
  updateSubscription,
} from "../controllers/subscriptionController.js";

const router = Router();

router.get("/", listSubscriptions);
router.get("/active", getActiveSubscription);
router.get("/:id", validate({ params: idParamSchema }), getSubscription);
router.put(
  "/:id",
  validate({ params: idParamSchema, body: updateSubscriptionSchema }),
  updateSubscription
);

export default router;
