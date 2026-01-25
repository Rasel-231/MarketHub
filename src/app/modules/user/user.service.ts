import { Prisma, User, UserRole, UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../../shared/prisma";
import { Request } from "express";
import { fileUploader } from "../../helpers/fileUploader";
import config from "../../../config";
import { paginationHelpers } from "../../helpers/paginationHelpers";
import { IPaginationOptions, IUserFilters } from "./user.interface";
import { searchableFileds } from "./user.constant";
import { uploadImage } from "../../utils/imageUpload";

const createUser = async (payload: Request) => {
    let profilePhoto = null;

    if (payload.file) {
        const uploadedResult = await fileUploader.uploadToCloudinary(payload.file);
        profilePhoto = uploadedResult?.secure_url;
    }

    const hashPassword = await bcrypt.hash(payload.body.password, Number(config.salt_round));

    return await prisma.$transaction(async (tnx: Prisma.TransactionClient) => {
        const newUser = await tnx.user.create({
            data: {
                name: payload.body.name,
                email: payload.body.email,
                password: hashPassword,
                contactNumber: payload.body.contactNumber,
                role: payload.body.role.toUpperCase() as UserRole
            }
        });

        if (payload.body.role === 'Seller') {
            await tnx.seller.create({
                data: {
                    userId: newUser.id,
                    profilePhoto,
                    shopName: payload.body.shopName || null,
                    shopSlug: payload.body.shopSlug || null
                }
            });
        } else if (payload.body.role === 'Admin') {
            await tnx.admin.create({
                data: {
                    userId: newUser.id,
                    profilePhoto
                }
            });
        }

        const fullUserData = await tnx.user.findUnique({
            where: { id: newUser.id },
            include: {
                admin: true,
                seller: true
            }
        });

        if (fullUserData) {
            (fullUserData as any).password = undefined;
        }

        return fullUserData;
    });
};

const getAllUsers = async (params: IUserFilters, options: IPaginationOptions) => {
    const { searchTerm, ...filtersData } = params;
    const andConditions: Prisma.UserWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: searchableFileds.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    if (Object.keys(filtersData).length) {
        andConditions.push({
            AND: Object.entries(filtersData).map(([key, value]) => ({
                [key]: { equals: value },
            })),
        });
    }

    const { limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(options);
    const whereConditions: Prisma.UserWhereInput = andConditions.length ? { AND: andConditions } : {};

    const users = await prisma.user.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
        include: {
            admin: true,
            seller: true,
        },
    });

    const total = await prisma.user.count({ where: whereConditions });

    return {
        meta: {
            page: options.page || 1,
            limit,
            total
        },
        data: users
    };
};

const getSingleUser = async (userId: string): Promise<User | null> => {
    return await prisma.user.findUnique({
        where: { id: userId },
        include: {
            admin: true,
            seller: true
        }
    });
};

const updateUser = async (userId: string, payload: Partial<User>, file: Request): Promise<User> => {
    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId }
    });

    const profilePhoto = await uploadImage(file);
    const updateData: any = { ...payload };

    if (profilePhoto) {
        const relationKey = user.role.toLowerCase();

        if (relationKey === 'admin' || relationKey === 'seller') {
            updateData[relationKey] = {
                update: { profilePhoto }
            };
        }
    }

    return await prisma.user.update({
        where: { id: userId },
        data: updateData,
        include: {
            admin: true,
            seller: true
        }
    });
};

const userDelete = async (userId: string) => {
    return await prisma.user.update({
        where: { id: userId },
        data: { status: UserStatus.INACTIVE },
    });
};

export const userService = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    userDelete
};