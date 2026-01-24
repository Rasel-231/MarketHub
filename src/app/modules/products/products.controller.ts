import { Request, Response } from "express"
import catchAsync from "../../shared/catchAsync"
import sendResponse from "../../shared/sendResponse";
import { productsService } from "./products.service";
import pick from "../../helpers/pick";
import { productFilterableFields, productSearchableFields } from "./products.constant";
import httpStatus from "http-status";

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, productSearchableFields);
    const filters = pick(req.query, productFilterableFields);
    const result = await productsService.getAllProducts(options, filters);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Products retrieved successfully",
        data: result,
    });
})

const createProduct = catchAsync(async (req: Request, res: Response) => {
    const productData = req.body;
    const result = await productsService.createProducts(productData);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product created successfully",
        data: result,
    });
})

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await productsService.deleteProducts(id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product deleted successfully",
        data: result,
    });
})

const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await productsService.updateProducts(id as string, payload);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product updated successfully",
        data: result,
    });
})

export const productController = {
    getAllProducts,
    createProduct,
    deleteProduct,
    updateProduct
}