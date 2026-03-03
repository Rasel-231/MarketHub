import express, { Router } from "express";
import { contactController } from "./contact.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router: Router = express.Router();

router.post('/create', contactController.createContact);
router.get('/', auth(UserRole.ADMIN), contactController.getAllContactMessages);
router.get('/:id', auth(UserRole.ADMIN), contactController.getSingleContactMessage);
router.delete('/:id', auth(UserRole.ADMIN), contactController.deleteContactMessage);

export const contactRoutes = router;