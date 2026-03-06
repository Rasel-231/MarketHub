import express from "express";
import { productController } from "./products.controller";
import { fileUploader } from "../../helpers/fileUploader";
const router = express.Router();

router.get("/", productController.getAllProducts);
router.post("/create", fileUploader.upload.single("products_image"), productController.createProduct);

router.get("/:id", productController.getSingleProducts);
router.delete("/:id", productController.deleteProduct);
router.patch("/:id", fileUploader.upload.single("products_image"), productController.updateProduct);


export const productsRoutes = router;
