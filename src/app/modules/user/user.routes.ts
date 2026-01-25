import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { UserValidation } from "./userValidation";
import { fileUploader } from "../../helpers/fileUploader";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { parseData } from "../../middlewares/parseData";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();
router.get("/", auth(UserRole.ADMIN), userController.getAllUsers);
router.post("/create-user", fileUploader.upload.single("profile_images"), parseData, validateRequest(UserValidation.createUserValidationSchema), userController.createUser);
router.get("/:id", auth(UserRole.ADMIN), userController.getSingleUser);
router.patch("/:id", auth(UserRole.ADMIN, UserRole.SELLER), fileUploader.upload.single("profile_images"), parseData, userController.updateUser);
router.delete("/:id", auth(UserRole.ADMIN), userController.deleteUser);


export const userRoutes = router;