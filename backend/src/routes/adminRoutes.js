import { Router } from "express";
import { getDashboardStats, getUserStats } from "../controllers/adminController.js";

const router = Router();

router.get("/dashboard", getDashboardStats);
router.get("/users/stats", getUserStats);

export default router;
