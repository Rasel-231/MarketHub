import express from "express";
import { productController } from "./products.controller";
import { fileUploader } from "../../helpers/fileUploader";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
const router = express.Router();

router.get("/", productController.getAllProducts);
router.post("/attribute/create", auth(UserRole.ADMIN, UserRole.SELLER), productController.createAttribute);
router.post("/create", fileUploader.upload.single("products_image"), productController.createProduct);
router.get("/attribute/:productId", auth(UserRole.ADMIN, UserRole.SELLER), productController.getAttributeByCategory);
router.get("/:id", productController.getSingleProducts);
router.delete("/:id", productController.deleteProduct);
router.patch("/:id", fileUploader.upload.single("products_image"), productController.updateProduct);


export const productsRoutes = router;
