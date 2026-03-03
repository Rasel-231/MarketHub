
import { Prisma, Products, ProductStatus, User } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import { productSearchableFields } from "./products.constant";
import { paginationHelpers } from "../../helpers/paginationHelpers";
import { fileUploader } from "../../helpers/fileUploader";
import { Request } from "express";
import { calculateDiscount } from "../../utils/calculateFn";
import ApiError from "../../shared/ApiError";
import httpStatus from 'http-status';



const createAttribute = async (data: any) => {
    return await prisma.categoryAttribute.create({
        data
    });
};

const getAttributesByCategory = async (categoryId: string) => {
    return await prisma.categoryAttribute.findMany({
        where: { categoryId },
        orderBy: { groupName: 'asc' }
    });
};


const createProducts = async (req: Request): Promise<Products & { sellingPrice: number; discountAmount: number }> => {
    const payload = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;

    let product_image: string[] = [];
    if (req.file) {
        const uploadedResult = await fileUploader.uploadToCloudinary(req.file);
        if (uploadedResult?.secure_url) {
            product_image = [uploadedResult.secure_url];
        }
    }

    if (!payload.categoryId) {
        throw new ApiError("Category ID is required", httpStatus.NOT_FOUND);
    }

    await prisma.categoryAttribute.findMany({
        where: { categoryId: payload.categoryId }
    });

    const productActualPrice = Number(payload.productActualPrice);
    const discountedRate = Number(payload.discountedRate);
    const { sellingPrice, discountAmount } = calculateDiscount(productActualPrice, discountedRate);
    const product: Products = await prisma.products.create({
        data: {
            title: payload.title,
            description: payload.description,
            brand: payload.brand,
            colour: payload.colour || [],
            size: payload.size || [],
            status: payload.status || "AVAILABLE",
            images: product_image,
            productActualPrice,
            discountedRate,
            stock: Number(payload.stock) || 0,
            specifications: payload.specifications || {},
            category: { connect: { id: payload.categoryId } },
            seller: { connect: { id: payload.sellerId } },
            user: { connect: { id: payload.userId } },
        },
    });

    return {
        ...product,
        sellingPrice,
        discountAmount,
    };
};
const getAllProducts = async (options: any, params: any) => {
    const { searchTerm, minPrice, maxPrice, ...filtersData } = params;
    const andConditions: any[] = [];
    if (searchTerm) {
        andConditions.push({
            OR: productSearchableFields.map(field => ({
                [field]: { contains: searchTerm, mode: "insensitive" }
            }))
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            AND: Object.entries(filtersData).map(([key, value]) => ({
                [key]: { equals: value }
            }))
        });
    }

    const { limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(options);
    const whereConditions: any = andConditions.length ? { AND: andConditions } : {};
    const products = await prisma.products.findMany({
        skip,
        take: limit,
        where: whereConditions,
        include: { review: true },
        orderBy:
            sortBy && sortOrder
                ? { [sortBy]: sortOrder }
                : { createdAt: "desc" },
    });

    const mappedProducts = products.map(product => {
        const { sellingPrice, discountAmount } = calculateDiscount(product.productActualPrice, product.discountedRate);
        return { ...product, sellingPrice, discountAmount };
    });

    const filteredProducts = mappedProducts.filter(product => {
        if (minPrice && product.sellingPrice < Number(minPrice)) return false;
        if (maxPrice && product.sellingPrice > Number(maxPrice)) return false;
        return true;
    });

    const total = filteredProducts.length;

    return {
        meta: {
            page: options.page || 1,
            limit,
            total
        },
        data: filteredProducts
    };
};
const getSingleProducts = async (productId: string) => {
    const product = await prisma.products.findUnique({
        where: { id: productId },
        include: { review: true },
    });

    if (!product) {
        return { data: [] }
    }

    const { sellingPrice, discountAmount } = calculateDiscount(
        product.productActualPrice,
        product.discountedRate
    );

    return {
        data: [{
            ...product,
            sellingPrice,
            discountAmount,
        }]
    };
};

const updateProducts = async (req: Request, productsId: string): Promise<Products> => {

    const body = req.body || {};


    let payload = body.data ? JSON.parse(body.data) : body;


    if (req.file) {
        const uploadProductImage = await fileUploader.uploadToCloudinary(req.file);
        if (uploadProductImage?.secure_url) {
            payload.images = [uploadProductImage.secure_url];
        }
    }

    if (payload.price) payload.price = parseFloat(payload.price.toString());
    if (payload.stock) payload.stock = parseInt(payload.stock.toString());
    if (payload.productActualPrice) payload.productActualPrice = Number(payload.productActualPrice);
    if (payload.discountedRate) payload.discountedRate = Number(payload.discountedRate);


    const updatedProducts = await prisma.products.update({
        where: { id: productsId },
        data: payload,
    });

    return updatedProducts;
}

const deleteProducts = async (productId: string) => {
    const deletedProduct = await prisma.products.update({
        where: { id: productId, status: ProductStatus.AVAILABLE },
        data: { status: ProductStatus.OUT_OF_STOCK },
    });
    return deletedProduct;
}

const searchProductsForChatbot = async (query: any) => {
    const { keyword, brand, categoryId, minPrice, maxPrice } = query;

    const andConditions: Prisma.ProductsWhereInput[] = [];

    if (keyword) {
        andConditions.push({
            OR: [
                { title: { contains: keyword, mode: "insensitive" } },
                { description: { contains: keyword, mode: "insensitive" } },
            ],
        });
    }

    if (brand) {
        andConditions.push({ brand: { contains: brand, mode: "insensitive" } });
    }

    if (categoryId) {
        andConditions.push({ categoryId: categoryId });
    }

    andConditions.push({ stock: { gt: 0 } });
    andConditions.push({ status: ProductStatus.AVAILABLE });

    const whereConditions: Prisma.ProductsWhereInput = andConditions.length
        ? { AND: andConditions }
        : {};

    const products = await prisma.products.findMany({
        where: whereConditions,
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { review: true, category: true, seller: true },
    });

    // Map products with dynamic sellingPrice & discountAmount
    const mappedProducts = products.map(p => {
        const { sellingPrice, discountAmount } = calculateDiscount(
            p.productActualPrice,
            p.discountedRate
        );
        return { ...p, sellingPrice, discountAmount };
    });

    // Apply minPrice / maxPrice filter dynamically
    const filteredProducts = mappedProducts.filter(p => {
        if (minPrice && p.sellingPrice < Number(minPrice)) return false;
        if (maxPrice && p.sellingPrice > Number(maxPrice)) return false;
        return true;
    });

    // rating average calculate
    const formatted = filteredProducts.map((p) => {
        const total = p.review.reduce((sum, r) => sum + r.rating, 0);
        const count = p.review.length;
        const avg = count > 0 ? +(total / count).toFixed(1) : 0;

        return {
            id: p.id,
            title: p.title,
            productActualPrice: p.productActualPrice,
            discountedRate: p.discountedRate,
            description: p.description,
            sellingPrice: p.sellingPrice,
            discountAmount: p.discountAmount,
            stock: p.stock,
            brand: p.brand,
            images: p.images,
            status: p.status,
            category: p.category,
            seller: p.seller,
            ratingAvg: avg,
            ratingCount: count,
        };
    });

    return formatted;
};

export const productsService = {
    createAttribute,
    getAttributesByCategory,
    createProducts,
    getAllProducts,
    getSingleProducts,
    updateProducts,
    deleteProducts,
    searchProductsForChatbot,


};
