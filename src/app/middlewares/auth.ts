import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../helpers/jwtHelpers";
import ApiError from "../shared/ApiError";

export const auth = (...roles: string[]) => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        console.log("Req", req);
        try {
            const token = req?.cookies?.accessToken;
            if (!token) {
                throw new ApiError("You are not Authorized", 401);
            }
            const verifyUser = jwtHelpers.verifyToken(token);
            console.log("Verifyuser", verifyUser);
            req.user = verifyUser;
            if (roles.length && !roles.includes(verifyUser.role)) {
                throw new ApiError("You are not Authorized to access this route", 401);
            } next();
        } catch (error) {
            next(error);
        }

    };
};