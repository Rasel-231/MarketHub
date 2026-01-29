import express from 'express';
import { UserRole } from '@prisma/client';

import { reviewController } from './review.controller';
import { auth } from '../../middlewares/auth';

const router = express.Router();

router.post(
    "/create",
    auth(UserRole.BUYER, UserRole.SELLER, UserRole.ADMIN),
    reviewController.createReview
);

export const reviewRoutes = router;