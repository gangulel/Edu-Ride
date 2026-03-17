import { Router } from "express";
import { getVehicles, addVehicle, updateVehicle, removeVehicle } from "../controllers/vehicleController.js";

const router = Router();

router.get("/", getVehicles);
router.post("/", addVehicle);
router.put("/:id", updateVehicle);
router.delete("/:id", removeVehicle);

export default router;
