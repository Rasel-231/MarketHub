import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from 'http-status';
import { attributeService } from "./attribute.service";

const createAttribute = catchAsync(async (req: Request, res: Response) => {
    const result = await attributeService.createAttribute(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Attribute created successfully",
        data: result,
    });
})
const getAttributeByCategory = catchAsync(async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const result = await attributeService.getAttributesByCategory(categoryId as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Attribute retrieved successfully",
        data: result,
    });
})
export const attributeController = {
    createAttribute,
    getAttributeByCategory
}