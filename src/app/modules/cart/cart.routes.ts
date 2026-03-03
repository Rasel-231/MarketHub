import express from "express";
import { cartController } from "./cart.controller";
import { auth } from "../../middlewares/auth";
const router = express.Router();
router.post("/add", auth(), cartController.addProductToCart);
router.get("/get-cart", auth(), cartController.getCart);
router.patch("/:id", cartController.updateQuantity);
router.delete("/:id", auth(), cartController.deleteCartItem);

export const cartRoutes = router;