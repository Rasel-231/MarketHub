import express from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middlewares/auth";
const router = express.Router();
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deletecategory);
router.get("/", categoryController.getAllcategory);
router.post("/create", categoryController.createcategory);
export const categoryRoutes = router;
