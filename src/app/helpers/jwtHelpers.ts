import jwt, { Secret, SignOptions, JwtPayload } from "jsonwebtoken";
import config from "../../config";

type IPayload = {
    userId: string;
    role: string;
};

const accessTokenOptions: SignOptions = {
    expiresIn: config.jwt.jwt_expires_in as any,
    algorithm: "HS256",
};

const refreshTokenOptions: SignOptions = {
    expiresIn: config.jwt.jwt_refresh_expires_in as any,
    algorithm: "HS256",
};

const createAccessToken = (payload: IPayload): string => {
    return jwt.sign(
        payload,
        config.jwt.jwt_secret as Secret,
        accessTokenOptions
    );
};

const createRefreshToken = (payload: IPayload): string => {
    return jwt.sign(
        payload,
        config.jwt.jwt_secret as Secret,
        refreshTokenOptions
    );
};

const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(
        token,
        config.jwt.jwt_secret as Secret
    ) as JwtPayload;
};

export const jwtHelpers = {
    createAccessToken,
    createRefreshToken,
    verifyToken,
};
