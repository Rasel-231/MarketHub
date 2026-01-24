import express from "express";
import { productController } from "./products.controller";
const router = express.Router();
router.delete("/:id", productController.deleteProduct);
router.put("/:id", productController.updateProduct);
router.get("/", productController.getAllProducts);
router.post("/create", productController.createProduct);
export const productsRoutes = router;
