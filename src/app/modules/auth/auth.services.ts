import { UserStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import { jwtHelpers } from "../../helpers/jwtHelpers";

const login = async (payload: { email: string, password: string }) => {
    console.log(payload);
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.Active
        }
    })

    const isPasswordValid = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordValid) {
        throw new Error("Password is Incorrect");
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