import { Router } from "express";
import { getEarningsSummary } from "../controllers/earningController.js";

const router = Router();

router.get("/", getEarningsSummary);

export default router;
