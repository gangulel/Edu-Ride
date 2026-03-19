import { Router } from "express";
import { getVehicles, addVehicle, updateVehicle, removeVehicle } from "../controllers/vehicleController.js";
import { validate } from "../middleware/validate.js";
import { createVehicleSchema, idParamSchema, updateVehicleSchema } from "../validators/schemas.js";

const router = Router();

router.get("/", getVehicles);
router.post("/", validate({ body: createVehicleSchema }), addVehicle);
router.put("/:id", validate({ params: idParamSchema, body: updateVehicleSchema }), updateVehicle);
router.delete("/:id", validate({ params: idParamSchema }), removeVehicle);

export default router;
