import { Request, Response } from "express"
import catchAsync from "../../shared/catchAsync"
import sendResponse from "../../shared/sendResponse";
import { productsService } from "./products.service";
import pick from "../../helpers/pick";
import { productFilterableFields } from "./products.constant";
import httpStatus from "http-status";




const createProduct = catchAsync(async (req: Request, res: Response) => {
    const result = await productsService.createProducts(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product created successfully",
        data: result,
    });
})
const getAllProducts = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const filters = pick(req.query, productFilterableFields);
    console.log("options", options);
    console.log("filters", filters);
    const result = await productsService.getAllProducts(options, filters);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Products retrieved successfully",
        data: result,
    });
})
const getSingleProducts = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await productsService.getSingleProducts(id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product retrieved successfully",
        data: result,
    });
})
const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await productsService.updateProducts(req, id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Product updated successfully",
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

export const productController = {
    createProduct,
    getAllProducts,
    getSingleProducts,
    updateProduct,
    deleteProduct,
}