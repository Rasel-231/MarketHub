import express from 'express';
import { paymentController } from './payment.controller';

const router = express.Router();


router.post('/success', paymentController.paymentSuccess);
router.post('/fail', paymentController.paymentFail);
router.post('/cancel', paymentController.paymentCancel);

export const paymentRoutes = router;