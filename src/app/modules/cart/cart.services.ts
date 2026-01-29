import { ProductStatus } from "@prisma/client";
import ApiError from "../../shared/ApiError";
import { prisma } from "../../shared/prisma";
import httpStatus from "http-status";
import { ICart } from "./cart.interface";

const addProductToCart = async (userId: string, payload: ICart) => {

    const product = await prisma.products.findUniqueOrThrow({
        where: { id: payload.productId }
    });

    if (product.status === ProductStatus.OUT_OF_STOCK) {
        throw new ApiError("Product is out of stock", httpStatus.BAD_REQUEST);
    }

    if (product.stock < payload.quantity) {
        throw new ApiError(`Only ${product.stock} items available`, httpStatus.BAD_REQUEST);
    }

    let cart = await prisma.cart.findUnique({
        where: { userId: userId }
    });

    if (!cart) {
        cart = await prisma.cart.create({
            data: { userId }
        });
    }

    return await prisma.cartItem.upsert({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId: payload.productId
            }
        },
        update: {
            quantity: {
                increment: payload.quantity
            }
        },
        create: {
            cartId: cart.id,
            productId: payload.productId,
            quantity: payload.quantity,
            price: product.price
        }
    });
};

const updateQuantity = async (payload: ICart) => {
    const cart = await prisma.cart.findUniqueOrThrow({
        where: { userId: payload.userId }
    });

    if (payload.quantity <= 0) {
        return await prisma.cartItem.delete({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: payload.productId
                }
            }
        });
    }

    const product = await prisma.products.findUniqueOrThrow({
        where: { id: payload.productId }
    });

    if (payload.quantity > product.stock) {
        throw new ApiError(`Stock limit exceeded. Only ${product.stock} left`, httpStatus.BAD_REQUEST);
    }

    return await prisma.cartItem.update({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId: payload.productId
            }
        },
        data: {
            quantity: payload.quantity
        }
    });
};

const getMyCart = async (userId: string) => {
    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });

    if (!cart) return { items: [], totalAmount: 0 };

    const totalAmount = cart.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);

    return {
        items: cart.items,
        totalAmount
    };
};

export const cartService = {
    addProductToCart,
    updateQuantity,
    getMyCart
};