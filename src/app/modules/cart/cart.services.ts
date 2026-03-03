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
            },
            flashSalePrice: Number(payload.flashSalePrice)
        },

        create: {
            cartId: cart.id,
            productId: payload.productId,
            quantity: payload.quantity,
            flashSalePrice: Number(payload.flashSalePrice)

        }
    });
};



const updateQuantity = async (itemId: string, quantity: number) => {
    const cartItem = await prisma.cartItem.findUniqueOrThrow({
        where: { id: itemId },
        include: { product: true }
    });

    if (quantity <= 0) {
        return await prisma.cartItem.delete({
            where: { id: itemId }
        });
    }

    const availableStock = cartItem.product.stock;
    if (quantity > availableStock) {
        throw new ApiError(`Only ${availableStock} items available in stock`, httpStatus.BAD_REQUEST);
    }

    return await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity }
    });
};


const getMyCart = async (userId: string) => {
    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            items: {
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    product: true
                }
            }
        }
    });

    if (!cart) return { items: [], totalAmount: 0 };

    const totalAmount = cart.items.reduce((acc, item) => {
        const price = item.flashSalePrice ?? 0;
        return acc + (item.quantity * price);
    }, 0);
    return {
        items: cart.items,
        totalAmount
    };
};




const deleteCartItem = async (itemId: string) => {
    const deletedItem = await prisma.cartItem.delete({
        where: { id: itemId },
    });
    return deletedItem;
};

export const cartService = {
    addProductToCart,
    updateQuantity,
    getMyCart,
    deleteCartItem
};