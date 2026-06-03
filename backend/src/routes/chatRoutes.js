import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { idParamSchema } from "../validators/schemas.js";
import {
  createConversationSchema,
  sendMessageSchema,
} from "../validators/additionalSchemas.js";
import {
  listConversations,
  startConversation,
  listMessages,
  sendMessage,
} from "../controllers/chatController.js";

const router = Router();

router.get("/", listConversations);
router.post("/", validate({ body: createConversationSchema }), startConversation);
router.get("/:id/messages", validate({ params: idParamSchema }), listMessages);
router.post(
  "/:id/messages",
  validate({ params: idParamSchema, body: sendMessageSchema }),
  sendMessage
);

export default router;
