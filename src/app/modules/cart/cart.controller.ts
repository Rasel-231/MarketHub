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
const updateQuantity = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { quantity } = req.body;

    const result = await cartService.updateQuantity(id, quantity);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Quantity updated",
        data: result,
    });
});
const deleteCartItem = catchAsync(async (req: Request, res: Response) => {
    const cartId = req.params.id as string;
    const result = await cartService.deleteCartItem(cartId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Cart deleted successfully",
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
    updateQuantity,
    getCart,
    deleteCartItem
};