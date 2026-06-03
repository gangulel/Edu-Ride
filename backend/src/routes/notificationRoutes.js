import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/schemas.js";
import { createNotificationSchema } from "../validators/additionalSchemas.js";
import {
  listNotifications,
  markRead,
  markAllRead,
  removeNotification,
  createNotificationForUser,
} from "../controllers/notificationController.js";

const router = Router();

router.get("/", listNotifications);
router.post("/", validate({ body: createNotificationSchema }), createNotificationForUser);
router.post("/read-all", markAllRead);
router.patch("/:id/read", validate({ params: idParamSchema }), markRead);
router.delete("/:id", validate({ params: idParamSchema }), removeNotification);

export default router;
