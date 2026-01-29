import express from "express";
import { cartController } from "./cart.controller";
const router = express.Router();
router.post("/add", cartController.addProductToCart);
router.post("/get-cart", cartController.getCart);
router.patch("/update-quantity", cartController.updateCartItemQuantity);
export const cartRoutes = router;