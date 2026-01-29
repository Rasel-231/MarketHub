import express from "express";
import { auth } from "../../middlewares/auth";
import { aiController } from "./aiAssistant.controller";
import { UserRole } from "@prisma/client";
import { userController } from "../../modules/user/user.controller";





const router = express.Router();
router.post("/chat", auth(UserRole.ADMIN, UserRole.BUYER, UserRole.SELLER), aiController.chatWithAi);

export const aiRoutes = router;