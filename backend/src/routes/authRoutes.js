import { Router } from "express";
import { register, login, adminLogin, googleAuth, forgotPassword, getMe } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { authRateLimiter, adminLoginRateLimiter } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validate.js";
import { adminLoginSchema, authLoginSchema, authRegisterSchema, forgotPasswordSchema, googleAuthSchema } from "../validators/schemas.js";

const router = Router();

router.post("/register", authRateLimiter, validate({ body: authRegisterSchema }), register);
router.post("/login", authRateLimiter, validate({ body: authLoginSchema }), login);
router.post("/admin/login", adminLoginRateLimiter, validate({ body: adminLoginSchema }), adminLogin);
router.post("/google", authRateLimiter, validate({ body: googleAuthSchema }), googleAuth);
router.post("/forgot", authRateLimiter, validate({ body: forgotPasswordSchema }), forgotPassword);
router.get("/me", authenticate, getMe);

export default router;
