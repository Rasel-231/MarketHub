import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

// Ekta generic type define kore nile error hobe na
type TErrorSources = {
    path: string | number;
    message: string;
}[];

const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    let message = err.message || "Something went wrong!";

    // path-ke string | number | symbol (PropertyKey) handle korar moto kore dilam
    let errorSources: TErrorSources = [
        {
            path: "",
            message: err.message || "Internal Server Error",
        },
    ];

    if (err instanceof ZodError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = "Validation Error";
        errorSources = err.issues.map((issue) => ({
            // .toString() add korle symbol thakleo sheta string hoye jabe, type error hobe na
            path: issue.path[issue.path.length - 1].toString(),
            message: issue.message,
        }));
    }
    else if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = "Prisma Validation Error";
        errorSources = [
            {
                path: "",
                message: err.message,
            },
        ];
    }
    else if (err instanceof Error) {
        message = err.message;
        errorSources = [
            {
                path: "",
                message: err.message,
            },
        ];
    }

    return res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: process.env.NODE_ENV === "development" ? err?.stack : null,
    });
};

export default globalErrorHandler;
