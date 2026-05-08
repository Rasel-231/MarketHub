import express, { Router } from 'express';
import { auth } from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { bannerController } from './banner.controller';
import { fileUploader } from '../../helpers/fileUploader';

const router: Router = express.Router();

router.post(
    "/add",
    auth(UserRole.ADMIN),
    fileUploader.upload,
    bannerController.addBanner
);

router.get(
    "/",
    bannerController.getAllBanners
);

router.delete(
    "/:id",
    auth(UserRole.ADMIN),
    bannerController.deleteBanner
);

export const bannerRoutes = router;