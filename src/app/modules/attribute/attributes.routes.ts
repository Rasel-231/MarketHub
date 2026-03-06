import express from 'express';
import { attributeController } from './attribute.controller';
const router = express.Router()

router.post("/create", attributeController.createAttribute)
router.get("/:categoryId", attributeController.getAttributeByCategory)
router.patch("/:categoryId")
router.delete("/:categoryId")

export const attributesRoutes = router