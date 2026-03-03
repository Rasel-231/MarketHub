import { Request, Response } from 'express';
import { paymentService } from './payment.service';
import catchAsync from '../../shared/catchAsync';
import config from '../../../config';
import { PaymentStatus } from '@prisma/client';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';

const paymentSuccess = catchAsync(async (req: Request, res: Response) => {
    const result = await paymentService.validatePaymentService(req.body);

    if (result.isValid) {
        res.redirect(`${config.frontend_url}/payment-success`);
    } else {
        res.redirect(`${config.frontend_url}/payment-fail`);
    }
});

const paymentFail = catchAsync(async (req: Request, res: Response) => {
    const { tranId } = req.query;
    await paymentService.handleFailedPayment(tranId as string, PaymentStatus.FAILD);
    res.redirect(`${config.frontend_url}/payment-fail`);
});

const paymentCancel = catchAsync(async (req: Request, res: Response) => {
    const { tranId } = req.query;
    await paymentService.handleFailedPayment(tranId as string, PaymentStatus.REFUNDED);
    res.redirect(`${config.frontend_url}/payment-cancel`);
});

const initiatePayment = catchAsync(async (req: Request, res: Response) => {
    const result = await paymentService.initiatePaymentService(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment gateway URL generated",
        data: result,
    });
});
export const paymentController = {
    paymentSuccess,
    paymentFail,
    paymentCancel,
    initiatePayment
};