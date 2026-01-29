import express from "express";
import { cartController } from "./cart.controller";
import { auth } from "../../middlewares/auth";
const router = express.Router();
router.post("/add", auth(), cartController.addProductToCart);
router.get("/get-cart", auth(), cartController.getCart);
router.patch("/update-quantity", cartController.updateCartItemQuantity);
export const cartRoutes = router;