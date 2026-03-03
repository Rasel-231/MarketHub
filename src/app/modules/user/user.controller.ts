import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";

import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { userService } from "./user.service";
import pick from "../../helpers/pick";
import { userFilterableFields } from "./user.constant";

const createUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await userService.createUser(req);
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
const getSingleUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await userService.getSingleUser(id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User retrieved successfully!",
        data: result,
    });
})
const getMyProfile = catchAsync(async (req: Request & { user?: any }, res: Response): Promise<void> => {
    const { userId } = req.user;
    const result = await userService.getMyProfile(userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Profile retrieved successfully!",
        data: result,
    });
});
const updateUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const payload = req.body;
    const file = req.file;

    const result = await userService.updateUser(id, payload, file);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User updated successfully!",
        data: result,
    });
});
const deleteUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await userService.userDelete(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User deleted successfully!",
        data: result,
    });
})


export const userController = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
    getMyProfile


}