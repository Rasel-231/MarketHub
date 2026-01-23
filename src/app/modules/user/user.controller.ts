import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";

import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { userService } from "./user.service";
import pick from "../../helpers/pick";
import { fi } from "zod/v4/locales";
import { userFilterableFields } from "./user.constant";

const createUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await userService.createUser(req)
    console.log("Database Result with Cloudinary URL:", result);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User created successfully!",
        data: result,
    });
})
const getAllUsers = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const options = pick(req.query, ['page', 'limit', 'searchTerm', 'sortOrder', 'sortBy']);
    const filters = pick(req.query, userFilterableFields);
    const result = await userService.getAllUsers(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users retrieved successfully!",
        meta: result.meta,
        data: result.data,
    });
})

export const userController = {
    createUser,
    getAllUsers
}