import { Router } from "express";
import { searchUsers } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/search", requireAuth, searchUsers);

export default router;
