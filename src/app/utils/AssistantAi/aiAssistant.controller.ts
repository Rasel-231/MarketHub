import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AIService } from "./aiAssistant.service";





const chatWithAi = catchAsync(async (req: Request, res: Response) => {
    const { prompt } = req.body;
    const userId = req.user?.id;
    console.log("req.user.id", req.user?.id);
    const result = await AIService.chatWithAi({ prompt, userId })

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'AI responded successfully',
        data: result,
    });
});

export const aiController = { chatWithAi };