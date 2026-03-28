import express from "express";
import { orderController } from "./order.controller";
import { UserRole } from "@prisma/client";
import { auth } from "../../middlewares/auth";

const router = express.Router();
router.post("/checkout", auth(UserRole.BUYER, UserRole.SELLER, UserRole.ADMIN), orderController.checkout);
router.get("/my-orders", auth(UserRole.BUYER, UserRole.SELLER, UserRole.ADMIN), orderController.getMyOrders);
router.get("/:id", auth(UserRole.BUYER, UserRole.SELLER, UserRole.ADMIN), orderController.getSingleOrder);
router.delete("/cancel/:id", auth(UserRole.BUYER, UserRole.SELLER, UserRole.ADMIN), orderController.cancelOrder);
router.patch("/update/:id", auth(UserRole.ADMIN, UserRole.SELLER, UserRole.BUYER), orderController.updateOrderStatus);

export const orderRoutes = router;