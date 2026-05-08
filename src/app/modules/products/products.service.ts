
import { CategoryAttribute, Prisma, Products, ProductStatus, User } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import { productSearchableFields } from "./products.constant";
import { paginationHelpers } from "../../helpers/paginationHelpers";
import { fileUploader } from "../../helpers/fileUploader";
import { Request } from "express";
import { calculateDiscount } from "../../utils/calculateFn";
import ApiError from "../../shared/ApiError";
import httpStatus from 'http-status';







// const createProducts = async (req: Request): Promise<Products & { sellingPrice: number; discountAmount: number }> => {

//     const payload = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;


//     let product_images: string[] = [];
//     const files = req.files as Express.Multer.File[];

//     if (files && files.length > 0) {

//         const uploadPromises = files.map((file) => fileUploader.uploadToCloudinary(file));
//         const uploadResults = await Promise.all(uploadPromises);


//         product_images = uploadResults
//             .filter((result) => result !== undefined)
//             .map((result) => result!.secure_url);
//     }


//     if (!payload.categoryId) {
//         throw new ApiError("Category ID is required", httpStatus.NOT_FOUND,);
//     }



//     const attributes = payload.attributes || {};


//     const productActualPrice = Number(payload.productActualPrice) || 0;
//     const discountedRate = Number(payload.discountedRate) || 0;

//     const { sellingPrice, discountAmount } = calculateDiscount(productActualPrice, discountedRate);


//     const product: Products = await prisma.products.create({
//         data: {
//             title: payload.title,
//             description: payload.description,
//             brand: payload.brand,
//             status: payload.status || "AVAILABLE",
//             images: product_images,
//             productActualPrice,
//             discountedRate,
//             stock: Number(payload.stock) || 0,
//             specifications: attributes,
//             category: { connect: { id: payload.categoryId } },
//             seller: { connect: { id: payload.sellerId } },
//             user: { connect: { id: payload.userId } },
//         },
//     });

//     return {
//         ...product,
//         sellingPrice,
//         discountAmount,
//     };
// };
const getAllProducts = async (options: any, params: any) => {
    const {
        searchTerm,
        minPrice,
        maxPrice,
        category,
        brand,
        rating,
        ...filtersData
    } = params;

    const andConditions: any[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: [
                { title: { contains: searchTerm, mode: "insensitive" } },
                { description: { contains: searchTerm, mode: "insensitive" } },
                { brand: { contains: searchTerm, mode: "insensitive" } }
            ]
        });
    }

    if (rating) {
        andConditions.push({
            review: {
                some: {
                    rating: { gte: Number(rating) }
                }
            }
        });
    }

    if (category) {
        andConditions.push({
            category: {
                name: {
                    equals: category,
                    mode: "insensitive"
                }
            }
        });
    }
    if (brand) {
        andConditions.push({ brand: { equals: brand, mode: "insensitive" } });
    }
    if (!filtersData.status) {
        andConditions.push({ status: "AVAILABLE" });
    }

    if (minPrice || maxPrice) {
        andConditions.push({
            productActualPrice: {
                ...(minPrice && { gte: Number(minPrice) }),
                ...(maxPrice && { lte: Number(maxPrice) }),
            }
        });
    }

    if (Object.keys(filtersData).length > 0) {
        Object.keys(filtersData).forEach((key) => {
            andConditions.push({
                [key]: (filtersData as any)[key]
            });
        });
    }

    const { limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(options);
    const whereConditions: any = andConditions.length > 0 ? { AND: andConditions } : {};

    const [products, total] = await (prisma as any).$transaction([
        (prisma as any).products.findMany({
            where: whereConditions,
            skip,
            take: limit,
            include: {
                review: true,
                category: true,

                seller: { select: { shopName: true } }
            },
            orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
        }),
        (prisma as any).products.count({ where: whereConditions })
    ]);

    const mappedProducts = products.map((product: any) => {
        const { discountAmount, sellingPrice } = (calculateDiscount as any)(
            product.productActualPrice,
            product.discountedRate
        );

        return {
            ...product,
            sellingPrice,
            discountAmount
        };
    });

    return {
        meta: {
            page: Number(options.page) || 1,
            limit,
            total
        },
        data: mappedProducts
    };
};
const createProducts = async (req: Request): Promise<Products & { sellingPrice: number; discountAmount: number }> => {
    const payload = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;

    let product_images: string[] = [];
    const files = req.files as Express.Multer.File[];

    if (files && files.length > 0) {
        const uploadPromises = files.map((file) => fileUploader.uploadToCloudinary(file));
        const uploadResults = await Promise.all(uploadPromises);

        product_images = uploadResults
            .filter((result) => result !== undefined)
            .map((result) => result!.secure_url);
    }

    if (!payload.categoryId) {

        throw new ApiError("Category ID is required", httpStatus.NOT_FOUND,);
    }

    await prisma.categoryAttribute.findMany({
        where: { categoryId: payload.categoryId }
    });

    const attributes = payload.attributes || {};

    const productActualPrice = Number(payload.productActualPrice) || 0;
    const discountedRate = Number(payload.discountedRate) || 0;

    const { sellingPrice, discountAmount } = calculateDiscount(productActualPrice, discountedRate);

    const product: Products = await prisma.products.create({
        data: {
            title: payload.title,
            description: payload.description,
            brand: payload.brand,
            status: payload.status || "AVAILABLE",
            images: product_images,
            productActualPrice,
            discountedRate,
            stock: Number(payload.stock) || 0,
            specifications: attributes,
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
    const payload = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;

    // ১. আগের ইমেজগুলো ডাটাবেজ থেকে নিয়ে আসা (নতুন গুলোর সাথে যোগ করার জন্য)
    const currentProduct = await prisma.products.findUnique({
        where: { id: productsId },
        select: { images: true }
    });

    if (!currentProduct) {
        throw new ApiError("Product not found", httpStatus.NOT_FOUND);
    }

    // ২. নতুন ইমেজ হ্যান্ডেলিং
    let new_images: string[] = [];
    const files = req.files as Express.Multer.File[];

    if (files && files.length > 0) {
        const uploadPromises = files.map((file) => fileUploader.uploadToCloudinary(file));
        const uploadResults = await Promise.all(uploadPromises);

        new_images = uploadResults
            .filter((result) => result !== undefined)
            .map((result) => result!.secure_url);
    }

    // ৩. আগের ইমেজ + নতুন ইমেজ (Merge)
    const finalImages = [...(currentProduct.images as string[]), ...new_images];

    // ৪. আপনার create function এর স্টাইলে ম্যাপিং এবং আপডেট
    const updatedProducts = await prisma.products.update({
        where: { id: productsId },
        data: {
            title: payload.title, // যদি payload এ থাকে তবে আপডেট হবে, না থাকলে আগেরটা থাকবে
            description: payload.description,
            brand: payload.brand,
            status: payload.status,
            images: finalImages,
            productActualPrice: payload.productActualPrice ? Number(payload.productActualPrice) : undefined,
            discountedRate: payload.discountedRate ? Number(payload.discountedRate) : undefined,
            stock: payload.stock !== undefined ? Number(payload.stock) : undefined,
            specifications: payload.attributes || payload.specifications,

            // রিলেশনাল ফিল্ড আপডেট (আপনার create এর মতোই connect ব্যবহার করে)
            ...(payload.categoryId && { category: { connect: { id: payload.categoryId } } }),
            ...(payload.sellerId && { seller: { connect: { id: payload.sellerId } } }),
            ...(payload.userId && { user: { connect: { id: payload.userId } } }),
        },
    });

    return updatedProducts;
};
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
    createProducts,
    getAllProducts,
    getSingleProducts,
    updateProducts,
    deleteProducts,
    searchProductsForChatbot,


};
