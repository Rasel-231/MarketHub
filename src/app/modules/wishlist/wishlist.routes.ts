import express from "express";
import { wishlistController } from "./wishlist.controller";

const router = express.Router();

router.post("/add", wishlistController.addWishlist);
router.get("/", wishlistController.getWishlist);
router.delete("/:wishlistId", wishlistController.deleteWishlist);

export const wishlistRoutes = router