import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/schemas.js";
import { createPaymentSchema } from "../validators/additionalSchemas.js";
import { listPayments, createPayment, getPayment } from "../controllers/paymentController.js";

const router = Router();

router.get("/", listPayments);
router.post("/", validate({ body: createPaymentSchema }), createPayment);
router.get("/:id", validate({ params: idParamSchema }), getPayment);

export default router;
