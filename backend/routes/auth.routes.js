import { Router } from "express";
import { getMe, isUserAuthenticated, login, sendOtp } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/send-otp", sendOtp);
router.post("/login", login);
router.get("/is-user-authenticated", isUserAuthenticated);
router.get("/me", requireAuth, getMe);

export default router;
