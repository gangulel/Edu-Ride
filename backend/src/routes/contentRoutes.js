import { Router } from "express";
import { getAdminContent } from "../controllers/contentController.js";

const router = Router();

router.get("/admin-content", getAdminContent);

export default router;
