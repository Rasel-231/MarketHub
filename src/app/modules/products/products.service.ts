
import { Prisma, Products, ProductStatus, User } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import { productSearchableFields } from "./products.constant";
import { paginationHelpers } from "../../helpers/paginationHelpers";
import { fileUploader } from "../../helpers/fileUploader";
import { Request } from "express";

const createProducts = async (req: Request) => {
    const payload = typeof req.body.data === 'string'
        ? JSON.parse(req.body.data)
        : req.body;


    let product_image: string[] = [];

    if (req.file) {
        const uploadedResult = await fileUploader.uploadToCloudinary(req.file);
        product_image = [uploadedResult?.secure_url as string];

    }


    return await prisma.products.create({
        data: {
            title: payload.title,
            description: payload.description,
            brand: payload.brand,
            userId: payload.userId,
            categoryId: payload.categoryId,
            sellerId: payload.sellerId,
            status: payload.status || 'AVAILABLE',
            images: product_image,
            price: parseFloat(payload.price),
            stock: parseInt(payload.stock),
        }

    });

};

const getAllProducts = async (options: any, params: any) => {
    const { searchTerm, minPrice, maxPrice, ...filtersData } = params;
    const andConditions: Prisma.ProductsWhereInput[] = [];

    //search term
    if (searchTerm) {
        andConditions.push({
            OR: productSearchableFields.map(field => ({
                [field]: { contains: searchTerm, mode: "insensitive" }
            }))
        })
    }

    if (minPrice || maxPrice) {
        andConditions.push({
            price: {
                gte: minPrice ? parseFloat(minPrice as string) : undefined,
                lte: maxPrice ? parseFloat(maxPrice as string) : undefined
            }
        });
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
        include: { review: true }
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
const getSingleProducts = async (productId: string) => {
    const product = await prisma.products.findUnique({
        where: { id: productId },
    });
    return product;
}
const updateProducts = async (req: Request, productsId: string): Promise<Products> => {
    // ১. বডি চেক করা যাতে 'undefined' এরর না আসে
    const body = req.body || {};

    // ২. ডাটা পার্সিং (form-data হ্যান্ডেল করার জন্য)
    let payload = body.data ? JSON.parse(body.data) : body;

    // ৩. ইমেজ হ্যান্ডলিং
    if (req.file) {
        const uploadProductImage = await fileUploader.uploadToCloudinary(req.file);
        if (uploadProductImage?.secure_url) {
            payload.images = [uploadProductImage.secure_url];
        }
    }

    // ৪. টাইপ কনভার্সন (Prisma এর জন্য মাস্ট)
    if (payload.price) payload.price = parseFloat(payload.price.toString());
    if (payload.stock) payload.stock = parseInt(payload.stock.toString());

    // ৫. ডাটাবেজ আপডেট
    const updatedProducts = await prisma.products.update({
        where: { id: productsId },
        data: payload,
    });

    return updatedProducts;
}
//I dont delete product permanently, I just change the status to OUT_OF_STOCK For Future history Purpose
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

    if (minPrice || maxPrice) {
        andConditions.push({
            price: {
                gte: minPrice ? parseFloat(minPrice) : undefined,
                lte: maxPrice ? parseFloat(maxPrice) : undefined,
            },
        });
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

    // rating average calculate
    const formatted = products.map((p) => {
        const total = p.review.reduce((sum, r) => sum + r.rating, 0);
        const count = p.review.length;
        const avg = count > 0 ? +(total / count).toFixed(1) : 0;

        return {
            id: p.id,
            title: p.title,
            price: p.price,
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
    createProducts,
    getAllProducts,
    getSingleProducts,
    updateProducts,
    deleteProducts,
    searchProductsForChatbot,


};
