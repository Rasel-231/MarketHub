import { Request, Response } from "express"
import catchAsync from "../../shared/catchAsync"
import { authService } from "./auth.services";

const login = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    const { accessToken, refreshToken } = result;
    res.cookie("accessToken", accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: result
    });

})
export const authController = {
    login
}