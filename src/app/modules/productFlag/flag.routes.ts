import express from 'express'
import { flagController } from './flag.controller';

const router = express.Router()

router.get('/flash-sales', flagController.getFlashSales);
router.get('/best-selling', flagController.getBestSelling);
router.get('/new-arrivals', flagController.getNewArrivals);
router.get('/featured', flagController.getFeaturedProducts);
router.get('/related/:productId', flagController.getRelatedProducts);
export const flagRoutes = router