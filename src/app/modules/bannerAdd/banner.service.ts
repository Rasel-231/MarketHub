import { BannerImages } from "@prisma/client";
import { Request } from "express";
import { prisma } from "../../shared/prisma";
import { fileUploader } from "../../helpers/fileUploader";

const addBanner = async (req: Request): Promise<BannerImages> => {
    let banner_images: string[] = [];
    const files = req.files as Express.Multer.File[];

    if (files && files.length > 0) {
        const uploadPromises = files.map((file) => fileUploader.uploadToCloudinary(file));
        const uploadResults = await Promise.all(uploadPromises);

        banner_images = uploadResults
            .filter((result) => result !== undefined)
            .map((result) => result!.secure_url);
    }

    const result = await prisma.bannerImages.create({
        data: {
            images: banner_images,
        },
    });
    return result;
};

const getAllBanners = async (): Promise<BannerImages[]> => {
    return await prisma.bannerImages.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
};

const deleteBanner = async (id: string): Promise<BannerImages> => {
    await prisma.bannerImages.findUniqueOrThrow({
        where: { id }
    });

    return await prisma.bannerImages.delete({
        where: { id }
    });
};

export const bannerService = {
    addBanner,
    getAllBanners,
    deleteBanner
};