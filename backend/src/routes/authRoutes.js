import { Router } from "express";
import { register, login, googleAuth, forgotPassword, getMe } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/forgot", forgotPassword);
router.get("/me", authenticate, getMe);

export default router;
