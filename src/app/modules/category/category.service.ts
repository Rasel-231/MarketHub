
import { Category, CategoryStatus, Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import { categorySearchableFields } from "./category.constant";
import { paginationHelpers } from "../../helpers/paginationHelpers";
import ApiError from "../../shared/ApiError";
import httpStatus from "http-status";

const createCategory = async (payload: any) => {
    const existcategory = await prisma.category.findFirst({
        where: {
            name: payload.name
        }
    })
    if (existcategory) {
        throw new ApiError('Category with this name already exists', httpStatus.CONFLICT);
    }
    const result = await prisma.category.create({
        data: payload
    });
    return result;
}
const getAllCategorys = async (options: any, params: any) => {
    const { searchTerm, ...filtersData } = params;
    const andConditions: Prisma.CategoryWhereInput[] = [];

    //search term
    if (searchTerm) {
        andConditions.push({
            OR: categorySearchableFields.map(field => ({
                [field]: { contains: searchTerm, mode: "insensitive" }
            }))
        })
    }

    //filters Data
    if (Object.keys(filtersData).length) {
        andConditions.push({
            AND: Object.entries(filtersData).map(([key, value]) => ({
                [key]: { equals: value }
            }))
        })
    }

    //pagination and sorting can be added here
    const { limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(options)
    const whereConditions: Prisma.CategoryWhereInput = andConditions.length ? { AND: andConditions } : {};
    const categorys = await prisma.category.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy:
            sortBy && sortOrder
                ? { [sortBy]: sortOrder }
                : { createdAt: "desc" },
    });

    const total = await prisma.category.count({
        where: whereConditions
    });
    return {
        meta: {
            page: options.page || 1,
            limit,
            total
        },
        data: categorys
    }
}

const getSingleCategory = async (categoryId: string): Promise<Category | null> => {
    const category = await prisma.category.findUnique({
        where: { id: categoryId },
    });
    return category;
};
const updateCategory = async (categoryId: string, payload: Partial<Category>): Promise<Category> => {
    const updatedCategory = await prisma.category.update({
        where: { id: categoryId, status: CategoryStatus.ACTIVE },
        data: payload,
    });
    return updatedCategory;
}
//I dont delete category permanently, I just change the status to INACTIVE For Future history Purpose
const deleteCategory = async (categoryId: string) => {
    const deletedcategory = await prisma.category.update({
        where: { id: categoryId, status: CategoryStatus.ACTIVE },
        data: { status: CategoryStatus.INACTIVE },
    });
    return deletedcategory;
}


export const categoryService = {
    createCategory,
    getAllCategorys,
    getSingleCategory,
    updateCategory,
    deleteCategory,

};
