import { Request, Response } from "express";
import { bannerService } from "./banner.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";

const addBanner = catchAsync(async (req: Request, res: Response) => {
    const result = await bannerService.addBanner(req);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Banner created successfully",
        data: result,
    });
});

const getAllBanners = catchAsync(async (req: Request, res: Response) => {
    const result = await bannerService.getAllBanners();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Banners fetched successfully",
        data: result,
    });
});

const deleteBanner = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const result = await bannerService.deleteBanner(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Banner deleted successfully",
        data: result,
    });
});

export const bannerController = {
    addBanner,
    getAllBanners,
    deleteBanner,
};