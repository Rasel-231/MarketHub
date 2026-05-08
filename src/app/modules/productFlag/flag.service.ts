import { Products, Review } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import { calculateDiscount } from "../../utils/calculateFn";
import { ProductPrice } from "./flag.interface";

const productPriceCalculation = (product: Products & { review?: Review[] }): ProductPrice => {
    const { sellingPrice, discountAmount } = calculateDiscount(
        Number(product.productActualPrice),
        Number(product.discountedRate)
    );
    return { ...product, sellingPrice, discountAmount };
};

const getFlashSales = async (): Promise<{ data: ProductPrice[] }> => {
    const now = new Date();
    const flashSales = await prisma.products.findMany({
        where: {
            flashSaleStart: { lte: now },
            flashSaleEnd: { gte: now },
        },
        include: {
            review: true,
        },
    });

    return {
        data: flashSales.map(productPriceCalculation),
    };
};

const getBestSelling = async (): Promise<{ data: any[] }> => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    // ১. প্রথমে সেল হওয়া প্রোডাক্টগুলো খোঁজা
    const topSellingItems = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        where: {
            order: {
                createdAt: { gte: startOfMonth },
                status: 'DELIVERED',
            },
        },
        orderBy: {
            _sum: { quantity: 'desc' },
        },
        take: 10,
    });

    let products;

    // ২. যদি সেল থাকে তবে সেই অনুযায়ী প্রোডাক্ট আনা
    if (topSellingItems.length > 0) {
        const productIds = topSellingItems.map((item) => item.productId);
        products = await prisma.products.findMany({
            where: { id: { in: productIds } },
            include: {
                review: true,
                category: true,
                seller: { select: { shopName: true } }
            },
        });
    }
    // ৩. যদি সেল না থাকে, তবে রিসেন্ট ১০টি প্রোডাক্ট আনা (নতুন লজিক)
    else {
        products = await prisma.products.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: {
                review: true,
                category: true,
                seller: { select: { shopName: true } }
            },
        });
    }

    // ৪. ফাইনাল ক্যালকুলেশন
    const data = products.map((product: any) => {
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

    return { data };
};

const getFeaturedproducts = async (): Promise<{ data: ProductPrice[] }> => {
    const featured = await prisma.products.findMany({
        where: { isFeatured: true },
        take: 10,
        include: {
            review: true,
        },
    });

    return {
        data: featured.map(productPriceCalculation),
    };
};

const getNewArrivals = async (): Promise<{ data: ProductPrice[] }> => {
    const arrivals = await prisma.products.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
            review: true,
        },
    });

    return {
        data: arrivals.map(productPriceCalculation),
    };
};

const getRelatedProducts = async (productId: string): Promise<ProductPrice[]> => {
    const product = await prisma.products.findUnique({
        where: { id: productId },
        select: {
            categoryId: true,
        },
    });

    if (!product || !product.categoryId) return [];

    const relatedProducts = await prisma.products.findMany({
        where: {
            categoryId: product.categoryId,
            NOT: {
                id: productId,
            },
            status: 'AVAILABLE',
        },
        take: 10,
        include: {
            review: true,
        },
    });

    return relatedProducts.map(productPriceCalculation)
};

export const flagService = {
    getFlashSales,
    getRelatedProducts,
    getBestSelling,
    getNewArrivals,
    getFeaturedproducts,
};