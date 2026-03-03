import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { contactService } from "./contact.services";

const createContact = catchAsync(async (req: Request, res: Response): Promise<void> => {
    if (!req.body.message || req.body.message.trim() === "") {
        res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "Message cannot be empty!"
        });
        return;
    }

    const result = await contactService.createContact(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Message sent successfully!",
        data: result
    });
});

const getAllContactMessages = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await contactService.getAllMessages();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All Messages retrieved successfully!",
        data: result
    });
});

const getSingleContactMessage = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const result = await contactService.getSingleMessage(id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Message retrieved successfully!",
        data: result
    });
});
const deleteContactMessage = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const result = await contactService.deleteMessage(id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Message deleted successfully!",
        data: result
    });
});

export const contactController = {
    createContact,
    getAllContactMessages,
    getSingleContactMessage,
    deleteContactMessage

};