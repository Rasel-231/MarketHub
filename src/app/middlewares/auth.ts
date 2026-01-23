import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../helpers/jwtHelpers";

export const auth = (...roles: string[]) => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        console.log("Req", req);
        try {
            const token = req?.cookies?.accessToken;
            if (!token) {
                throw new Error("You are not Authorized");
            }
            const verifyUser = jwtHelpers.verifyToken(token);
            console.log("Verifyuser", verifyUser);
            req.user = verifyUser;
            if (roles.length && !roles.includes(verifyUser.role)) {
                throw new Error("You are not Authorized to access this route");
            } next();
        } catch (error) {
            next(error);
        }

    };
};