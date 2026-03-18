import express from 'express';
import { attributeController } from './attribute.controller';
const router = express.Router()

router.post("/create", attributeController.createAttribute)
router.get("/:categoryId", attributeController.getAttributeByCategory)


export const attributesRoutes = router