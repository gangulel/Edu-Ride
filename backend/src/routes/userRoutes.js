import { Router } from "express";
import { listUsers, getUserById, updateUser, updateUserStatus, deleteUser } from "../controllers/userController.js";
import { requireRole } from "../middleware/roleCheck.js";
import { validate } from "../middleware/validate.js";
import { idParamSchema, updateUserSchema, updateUserStatusSchema, userListQuerySchema } from "../validators/schemas.js";

const router = Router();

router.get("/", requireRole("admin"), validate({ query: userListQuerySchema }), listUsers);
router.get("/:id", validate({ params: idParamSchema }), getUserById);
router.put("/:id", validate({ params: idParamSchema, body: updateUserSchema }), updateUser);
router.put("/:id/status", requireRole("admin"), validate({ params: idParamSchema, body: updateUserStatusSchema }), updateUserStatus);
router.delete("/:id", requireRole("admin"), validate({ params: idParamSchema }), deleteUser);

export default router;
