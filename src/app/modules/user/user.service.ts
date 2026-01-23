import { Prisma, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../../shared/prisma";
import { Request } from "express";
import { fileUploader } from "../../helpers/fileUploader";
import config from "../../../config";
import { paginationHelpers } from "../../helpers/paginationHelpers";

import { IPaginationOptions, IUserFilters } from "./user.interface";
import { searchableFileds } from "./user.constant";

const createUser = async (req: Request) => {
    let profilePhoto = null;

    // ক্লাউডিনারিতে আপলোড
    if (req.file) {
        const uploadedResult = await fileUploader.uploadToCloudinary(req.file);
        profilePhoto = uploadedResult?.secure_url;
    }

    const hashPassword = await bcrypt.hash(req.body.password, Number(config.salt_round));

    const result = await prisma.$transaction(async (tnx: Prisma.TransactionClient) => {
        // ১. ইউজার তৈরি
        const newUser = await tnx.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: hashPassword,
                contactNumber: req.body.contactNumber,
                role: req.body.role
            }
        });

        // ২. রোল অনুযায়ী রিলেশনাল ডাটা তৈরি
        if (req.body.role === 'Seller') {
            await tnx.seller.create({
                data: {
                    userId: newUser.id,
                    profilePhoto: profilePhoto
                }
            });
        } else if (req.body.role === 'Admin') {
            await tnx.admin.create({
                data: {
                    userId: newUser.id,
                    profilePhoto: profilePhoto
                }
            });
        }

        // ৩. রিলেশনসহ ডাটা রিটার্ন (এটি নিশ্চিত করবে Admin/Seller null আসবে না)
        const fullUserData = await tnx.user.findUnique({
            where: { id: newUser.id },
            include: {
                admin: true,
                seller: true
            }
        });

        // ৪. পাসওয়ার্ড সিকিউরিটি: রেসপন্স থেকে পাসওয়ার্ড সরিয়ে ফেলা
        if (fullUserData) {
            (fullUserData as any).password = undefined;
        }

        return fullUserData;
    });

    return result;
};



const getAllUsers = async (
    params: IUserFilters,
    options: IPaginationOptions
) => {
    const { searchTerm, ...filtersData } = params;

    const andConditions: Prisma.UserWhereInput[] = [];

    // 🔍 Search
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

    // 🎯 Filters
    if (Object.keys(filtersData).length) {
        andConditions.push({
            AND: Object.entries(filtersData).map(([key, value]) => ({
                [key]: { equals: value },
            })),
        });
    }

    const { limit, skip, sortBy, sortOrder } =
        paginationHelpers.calculatePagination(options);
    const whereConditions: Prisma.UserWhereInput = andConditions.length ? { AND: andConditions } : {};
    const users = await prisma.user.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy:
            sortBy && sortOrder
                ? { [sortBy]: sortOrder }
                : { createdAt: "desc" },
        include: {
            admin: true,
            seller: true,
        },
    });
    const total = await prisma.user.count({
        where: whereConditions
    });
    return {
        meta: {
            page: options.page || 1,
            limit,
            total
        },
        data: users
    };
};


export const userService = {
    createUser,
    getAllUsers
};