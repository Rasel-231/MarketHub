import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { adminService } from "./admin.service";

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllOrders();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All orders retrieved successfully",
        data: result
    });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await adminService.updateOrderStatus(id as string, status);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order status updated successfully",
        data: result
    });
});

export const adminController = {
    getAllOrders,
    updateOrderStatus
};