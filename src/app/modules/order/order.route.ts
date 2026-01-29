import express from "express";
import { orderController } from "./order.controller";
import { UserRole } from "@prisma/client";
import { auth } from "../../middlewares/auth";

const router = express.Router();
router.post("/checkout", auth(UserRole.BUYER, UserRole.SELLER, UserRole.ADMIN), orderController.checkout);
router.get("/my-orders", auth(UserRole.BUYER, UserRole.SELLER, UserRole.ADMIN), orderController.getMyOrders);
router.get("/:id", auth(UserRole.BUYER, UserRole.SELLER, UserRole.ADMIN), orderController.getSingleOrder);
router.patch("/:id", auth(UserRole.ADMIN), orderController.getSingleOrder);

export const orderRoutes = router;