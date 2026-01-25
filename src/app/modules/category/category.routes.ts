import express from "express";
import { categoryController } from "./category.controller";

const router = express.Router();
router.get("/", categoryController.getAllCategory);
router.post("/create", categoryController.createCategory);
router.get("/:id", categoryController.getSingleCategory);
router.patch("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);
export const categoryRoutes = router;
