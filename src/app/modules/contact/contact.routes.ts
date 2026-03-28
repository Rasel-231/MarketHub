import express, { Router } from "express";
import { contactController } from "./contact.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router: Router = express.Router();

router.post('/create', contactController.createContact);
router.post('/support/reply', contactController.supportReply);
router.get('/', contactController.getAllContactMessages);
router.get('/:id', contactController.getSingleContactMessage);
router.delete('/:id', contactController.deleteContactMessage);

export const contactRoutes = router;