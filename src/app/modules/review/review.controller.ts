import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { reviewService } from "./review.service";

const createReview = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await reviewService.createReview(user?.userId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Review submitted successfully",
        data: result
    });
});
const getAllReviews = catchAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const result = await reviewService.getAllReviews(productId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Reviews fetched successfully",
        data: result
    });
});

export const reviewController = {
    createReview,
    getAllReviews
};