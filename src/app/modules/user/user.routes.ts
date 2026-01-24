import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { UserValidation } from "./userValidation";
import { fileUploader } from "../../helpers/fileUploader";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
    "/create-user",
    fileUploader.upload.single("file"),
    (req: Request, res: Response, next: NextFunction) => {
        try {
            // "data" কি (key) থেকে আসা JSON স্ট্রিং পার্স এবং Zod ভ্যালিডেশন
            req.body = UserValidation.createUserValidationSchema.parse(
                JSON.parse(req.body.data)
            );
            userController.createUser(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);
router.get("/:id", auth(UserRole.ADMIN), userController.getSingleUser);
router.put("/:id", auth(UserRole.ADMIN, UserRole.SELLER), userController.updateUser);
router.delete("/:id", auth(UserRole.ADMIN), userController.deleteUser);
router.get("/", auth(UserRole.ADMIN), userController.getAllUsers);

export const userRoutes = router;