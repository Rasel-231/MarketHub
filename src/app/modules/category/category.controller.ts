import { Request, Response } from "express"
import catchAsync from "../../shared/catchAsync"
import sendResponse from "../../shared/sendResponse";
import { categoryService } from "./category.service";
import pick from "../../helpers/pick";
import { categoryFilterableFields, categorySearchableFields } from "./category.constant";
import httpStatus from "http-status";


const createCategory = catchAsync(async (req: Request, res: Response) => {
    const categoryData = req.body;
    const result = await categoryService.createCategory(categoryData);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "category created successfully",
        data: result,
    });
})
const getAllCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryService.getAllCategories();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "category retrieved successfully",
        data: result,
    });
})
const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await categoryService.getSingleCategory(id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category retrieved successfully",
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
const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await categoryService.deleteCategory(id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "category deleted successfully",
        data: result,
    });
})
const deleteCategoryParmanently = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await categoryService.deleteCategoryParmanently(id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "category deleted parmanently",
        data: result,
    });
})

export const categoryController = {
    createCategory,
    getAllCategory,
    getSingleCategory,
    updateCategory,
    deleteCategory,
    deleteCategoryParmanently

}