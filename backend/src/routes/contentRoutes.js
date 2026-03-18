import { Router } from "express";
import { getAdminContent, getPublicUsers } from "../controllers/contentController.js";

const router = Router();

router.get("/admin-content", getAdminContent);
router.get("/users", getPublicUsers);

export default router;
