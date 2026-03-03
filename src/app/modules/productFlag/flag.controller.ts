import { Request, Response } from "express"
import catchAsync from "../../shared/catchAsync"
import sendResponse from "../../shared/sendResponse";
import httpStatus from 'http-status';
import { flagService } from "./flag.service";

const getFlashSales = catchAsync(async (req: Request, res: Response) => {
    const result = await flagService.getFlashSales();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Flash Sales fetched successfully!",
        data: result,
    })
})

const getBestSelling = catchAsync(async (req: Request, res: Response) => {
    const result = await flagService.getBestSelling();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Best selling products fetched successfully!",
        data: result,
    })
})

const getFeaturedProducts = catchAsync(async (req: Request, res: Response) => {
    const result = await flagService.getFeaturedproducts();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Featured products fetched successfully!",
        data: result,
    })
})

const getNewArrivals = catchAsync(async (req: Request, res: Response) => {
    const result = await flagService.getNewArrivals();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "New arrivals fetched successfully!",
        data: result,
    })
})

const getRelatedProducts = catchAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const result = await flagService.getRelatedProducts(productId as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Related products fetched successfully!",
        data: result,
    })
})

export const flagController = {
    getFlashSales,
    getBestSelling,
    getNewArrivals,
    getFeaturedProducts,
    getRelatedProducts
}