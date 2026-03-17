import { Router } from "express";
import { listUsers, getUserById, updateUser, updateUserStatus, deleteUser } from "../controllers/userController.js";
import { requireRole } from "../middleware/roleCheck.js";

const router = Router();

router.get("/", requireRole("admin"), listUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.put("/:id/status", requireRole("admin"), updateUserStatus);
router.delete("/:id", requireRole("admin"), deleteUser);

export default router;
