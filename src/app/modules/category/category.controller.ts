import { Request, Response } from "express"
import catchAsync from "../../shared/catchAsync"
import sendResponse from "../../shared/sendResponse";
import { categoryService } from "./category.service";
import pick from "../../helpers/pick";
import { categoryFilterableFields, categorySearchableFields } from "./category.constant";
import httpStatus from "http-status";

const getAllcategory = catchAsync(async (req: Request, res: Response) => {
    const options = pick(req.query, categorySearchableFields);
    const filters = pick(req.query, categoryFilterableFields);
    const result = await categoryService.getAllcategorys(options, filters);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "category retrieved successfully",
        data: result,
    });
})

const createcategory = catchAsync(async (req: Request, res: Response) => {
    const categoryData = req.body;
    const result = await categoryService.createcategory(categoryData);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "category created successfully",
        data: result,
    });
})

const deletecategory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await categoryService.deletecategory(id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "category deleted successfully",
        data: result,
    });
})

const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await categoryService.updateCategory(id as string, payload);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category updated successfully",
        data: result,
    });
})

export const categoryController = {
    getAllcategory,
    createcategory,
    deletecategory,
    updateCategory,
}