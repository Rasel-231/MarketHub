import express from "express"
import { specificationController } from "./specification.controller"
const router = express.Router()
router.post("/create-specification/:id", specificationController.createSpecification)

export const specificationRoutes = router