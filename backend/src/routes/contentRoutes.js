import { Router } from "express";
import { getAdminContent, getPublicUsers } from "../controllers/contentController.js";
import { validate } from "../middleware/validate.js";
import { userListQuerySchema } from "../validators/schemas.js";

const router = Router();

router.get("/admin-content", getAdminContent);
router.get("/users", validate({ query: userListQuerySchema }), getPublicUsers);

export default router;
