import express from "express";
import { productController } from "./products.controller";
import { fileUploader } from "../../helpers/fileUploader";
const router = express.Router();
router.get("/", productController.getAllProducts);
router.post("/create", fileUploader.upload, productController.createProduct);
router.get("/:id", productController.getSingleProducts);
router.delete("/:id", productController.deleteProduct);
router.patch("/update/:id", fileUploader.upload, productController.updateProduct);

export const productsRoutes = router;
