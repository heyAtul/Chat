import { Router } from "express";
import { getChats } from "../controllers/chat.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:contactId", requireAuth, getChats);

export default router;
