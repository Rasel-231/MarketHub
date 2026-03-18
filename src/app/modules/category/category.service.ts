
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
const getAllCategories = async () => {
    const categories = await prisma.category.findMany();
    return {
        data: categories,
    };
};

const getSingleCategory = async (categoryId: string): Promise<Category | null> => {
    const category = await prisma.category.findUnique({
        where: { id: categoryId },
        include: {
            attributes: true,
        },
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
const deleteCategoryParmanently = async (categoryId: string) => {
    return await prisma.$transaction(async (tx) => {
        const category = await tx.category.findUnique({
            where: { id: categoryId },
            include: {
                products: true,
                attributes: true
            }
        });

        if (!category) {
            throw new Error("Category not found");
        }

        if (category.products && category.products.length > 0) {
            throw new Error("Cannot delete category. There are products associated with it.");
        }

        await tx.categoryAttribute.deleteMany({
            where: { categoryId: categoryId }
        });

        const deletedCategory = await tx.category.delete({
            where: { id: categoryId },
        });

        return deletedCategory;
    });
};

export const categoryService = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
    deleteCategoryParmanently

};
