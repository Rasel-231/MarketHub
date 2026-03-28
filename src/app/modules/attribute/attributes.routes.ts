import express from 'express';
import { attributeController } from './attribute.controller';
const router = express.Router()

router.post("/create", attributeController.createAttribute)
router.get("/:categoryId", attributeController.getAttributeByCategory)
router.put("/:productId", attributeController.updateAttribute)

export const attributesRoutes = router