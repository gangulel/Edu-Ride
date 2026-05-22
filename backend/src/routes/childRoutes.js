import { Router } from "express";
import { getChildren, addChild, updateChild, removeChild } from "../controllers/childController.js";
import { validate } from "../middleware/validate.js";
import { createChildSchema, idParamSchema, updateChildSchema } from "../validators/schemas.js";

const router = Router();

router.get("/", getChildren);
router.post("/", validate({ body: createChildSchema }), addChild);
router.put("/:id", validate({ params: idParamSchema, body: updateChildSchema }), updateChild);
router.delete("/:id", validate({ params: idParamSchema }), removeChild);

export default router;
