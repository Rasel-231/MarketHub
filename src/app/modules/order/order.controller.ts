import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { orderService } from "./order.service";

const checkout = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;


    const result = await orderService.checkout(user.id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Order placed successfully!",
        data: result
    });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await orderService.getMyOrders(user.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Orders retrieved successfully",
        data: result
    });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { id } = req.params;
    const result = await orderService.getSingleOrder(id as string, user.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order details retrieved successfully",
        data: result
    });
});
const cancelOrder = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const { id } = req.params;
    const result = await orderService.cancelOrder(id as string, user.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order cancelled and stock restored successfully",
        data: result
    });
});

export const orderController = {
    checkout,
    getMyOrders,
    getSingleOrder,
    cancelOrder
};