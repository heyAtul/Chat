import { Router } from "express";
import { addContact, getContacts } from "../controllers/contact.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getContacts);
router.post("/", requireAuth, addContact);

export default router;
