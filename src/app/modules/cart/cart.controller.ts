import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { cartService } from "./cart.services";
import httpStatus from "http-status";



const addProductToCart = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    console.log("userId", user.userId);
    const result = await cartService.addProductToCart(user.userId, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product added to cart successfully",
        data: result,
    });
});

const updateCartItemQuantity = catchAsync(async (req: Request, res: Response) => {
    const { productId, quantity } = req.body;
    const userId = req.user?.id;

    const result = await cartService.updateQuantity(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Cart updated successfully",
        data: result,
    });
});

const getCart = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await cartService.getMyCart(user.userId)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Cart retiribed successfully",
        data: result,
    })
})
export const cartController = {
    addProductToCart,
    updateCartItemQuantity,
    getCart
};