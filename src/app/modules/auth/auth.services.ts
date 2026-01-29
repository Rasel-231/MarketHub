import { UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import ApiError from "../../shared/ApiError";
import httpStatus from "http-status";


const login = async (payload: { email: string, password: string }) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })

    const isPasswordValid = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordValid) {
        throw new ApiError("Password is Incorrect", httpStatus.UNAUTHORIZED)
    }

    const accessToken = jwtHelpers.createAccessToken({
        userId: user.id,
        role: user.role,
    });
    const refreshToken = jwtHelpers.createRefreshToken({
        userId: user.id,
        role: user.role,
    });

    return {
        accessToken,
        refreshToken
    };
};

export const authService = {
    login
};