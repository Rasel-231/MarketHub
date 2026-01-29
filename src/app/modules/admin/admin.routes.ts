import express from "express";

import { UserRole } from "@prisma/client";
import { adminController } from "./admin.controller";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.get(
    "/orders",
    auth(UserRole.ADMIN),
    adminController.getAllOrders
);

router.patch(
    "/orders/:id/status",
    auth(UserRole.ADMIN),
    adminController.updateOrderStatus
);

export const adminRoutes = router;