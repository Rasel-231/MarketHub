import ApiError from "../../shared/ApiError";
import { prisma } from "../../shared/prisma";
import httpStatus from 'http-status';


const addWishlist = async (data: { userId: string; productId: string }) => {
    const existingwishlist = await prisma.wishlist.findFirst({
        where: {
            userId: data.userId,
            productId: data.productId
        }
    })
    if (existingwishlist) {
        throw new ApiError("Product already in wishlist", httpStatus.BAD_REQUEST);
    }
    const result = await prisma.wishlist.create({
        data: {
            userId: data.userId,
            productId: data.productId
        },
        include: {
            products: true
        }
    })
    return result;
}


const getMyWishlist = async () => {
    const result = await prisma.wishlist.findMany({
        include: {
            products: true
        }
    })
    return result;
}

const removeFromWishlist = async (wishlistId: string) => {
    const result = await prisma.wishlist.delete({
        where: { id: wishlistId }
    })
    return result;
}

export const wishlistService = {
    addWishlist,
    getMyWishlist,
    removeFromWishlist
}