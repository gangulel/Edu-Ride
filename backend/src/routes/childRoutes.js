import { Router } from "express";
import { getChildren, addChild, updateChild, removeChild } from "../controllers/childController.js";

const router = Router();

router.get("/", getChildren);
router.post("/", addChild);
router.put("/:id", updateChild);
router.delete("/:id", removeChild);

export default router;
