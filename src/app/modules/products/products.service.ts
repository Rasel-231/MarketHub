
import { Prisma, Products, ProductStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import { productSearchableFields } from "./products.constant";
import { paginationHelpers } from "../../helpers/paginationHelpers";



const getAllProducts = async (options: any, params: any) => {
    const { searchTerm, ...filtersData } = params;
    const andConditions: Prisma.ProductsWhereInput[] = [];

    //search term
    if (searchTerm) {
        andConditions.push({
            OR: productSearchableFields.map(field => ({
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
    const whereConditions: Prisma.ProductsWhereInput = andConditions.length ? { AND: andConditions } : {};
    const products = await prisma.products.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy:
            sortBy && sortOrder
                ? { [sortBy]: sortOrder }
                : { createdAt: "desc" },
    });

    const total = await prisma.products.count({
        where: whereConditions
    });
    return {
        meta: {
            page: options.page || 1,
            limit,
            total
        },
        data: products
    }
}

const createProducts = async (payload: any) => {
    const result = await prisma.products.create({
        data: payload
    });
    return result;
}
const deleteProducts = async (productId: string) => {
    const deletedProduct = await prisma.products.update({
        where: { id: productId, status: ProductStatus.AVAILABLE },
        data: { status: ProductStatus.OUT_OF_STOCK },
    });
    return deletedProduct;
}
const updateProducts = async (productsId: string, payload: Partial<Products>): Promise<Products> => {
    const updatedProducts = await prisma.products.update({
        where: { id: productsId, status: ProductStatus.AVAILABLE },
        data: payload,
    });
    return updatedProducts;
}

export const productsService = {
    getAllProducts,
    createProducts,
    deleteProducts,
    updateProducts
};
