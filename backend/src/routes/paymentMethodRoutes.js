import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/schemas.js";
import {
  createPaymentMethodSchema,
  updatePaymentMethodSchema,
} from "../validators/additionalSchemas.js";
import {
  listPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  removePaymentMethod,
} from "../controllers/paymentMethodController.js";

const router = Router();

router.get("/", listPaymentMethods);
router.post("/", validate({ body: createPaymentMethodSchema }), createPaymentMethod);
router.put(
  "/:id",
  validate({ params: idParamSchema, body: updatePaymentMethodSchema }),
  updatePaymentMethod
);
router.delete("/:id", validate({ params: idParamSchema }), removePaymentMethod);

export default router;
