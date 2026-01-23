import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    let message = err.message || "Something went wrong!";

    // ডেভেলপমেন্ট মোডে ডিবাগিংয়ের জন্য এরর স্ট্যাক দেখা জরুরি, 
    // কিন্তু প্রোডাকশনে এটি খালি রাখা ভালো।
    const errorResponse = {
        success: false,
        message,
        // এখানে পুরো 'err' অবজেক্টটি না পাঠিয়ে শুধু দরকারি অংশগুলো পাঠাচ্ছি
        errorSources: err.errorSources || [
            {
                path: '',
                message: err.message || "Internal Server Error",
            },
        ],
        stack: process.env.NODE_ENV === 'development' ? err?.stack : null,
    };

    return res.status(statusCode).json(errorResponse);
};

export default globalErrorHandler;