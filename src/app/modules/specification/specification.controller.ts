import { Request, Response } from "express"
import catchAsync from "../../shared/catchAsync"
import sendResponse from "../../shared/sendResponse"
import httpStatus from 'http-status';
import { specificationService } from "./specification.service";

const createSpecification = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await specificationService.createSpecification(req.body, id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Specification Created Successfully",
        data: result
    });
})

export const specificationController = {
    createSpecification
}