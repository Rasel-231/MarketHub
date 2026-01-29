
import { OrderStatus } from "@prisma/client";
import ApiError from "../../shared/ApiError";
import { prisma as db, prisma } from "../../shared/prisma";
import httpStatus from "http-status";

const checkout = async (userId: string, payload: { deliveryAddress: string }) => {
    return await db.$transaction(async (tx) => {
        const existingCart = await tx.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });

        if (!existingCart || existingCart.items.length === 0) {
            throw new ApiError("Your cart is empty", httpStatus.BAD_REQUEST);
        }

        for (const item of existingCart.items) {
            if (item.product.stock < item.quantity) {
                throw new ApiError(
                    `Product ${item.product.title} is out of stock. Available: ${item.product.stock}`,
                    httpStatus.BAD_REQUEST
                );
            }
        }

        const totalAmount = existingCart.items.reduce(
            (acc, item) => acc + (item.quantity * item.price),
            0
        );

        const createOrder = await tx.order.create({
            data: {
                userId,
                totalAmount,
                deliveryAddress: payload.deliveryAddress,
                status: "PENDING",
                orderItems: {
                    create: existingCart.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.price
                    }))
                }
            },
            include: {
                orderItems: true
            }
        });

        for (const item of existingCart.items) {
            await tx.products.update({
                where: { id: item.productId },
                data: {
                    stock: {
                        decrement: item.quantity
                    }
                }
            });
        }

        await tx.cartItem.deleteMany({
            where: { cartId: existingCart.id }
        });

        return createOrder;
    });
};

const getMyOrders = async (userId: string) => {
    return await db.order.findMany({
        where: { userId },
        include: {
            orderItems: {
                include: { product: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
};

const getSingleOrder = async (orderId: string, userId: string) => {
    return await db.order.findFirstOrThrow({
        where: {
            id: orderId,
            userId: userId
        },
        include: {
            orderItems: {
                include: { product: true }
            }
        }
    });
};

const cancelOrder = async (userId: string, orderId: string): Promise<void> => {
    return await prisma.$transaction(async (tr) => {
        const existingOrder = await tr.order.findUnique({
            where: { id: orderId },
            include: { orderItems: true }
        });

        if (!existingOrder) {
            throw new ApiError("Order not found", httpStatus.NOT_FOUND,);
        }

        if (existingOrder.userId !== userId) {
            throw new ApiError("Unauthorized access", httpStatus.FORBIDDEN,);
        }

        const restrictedStatuses: OrderStatus[] = [OrderStatus.CANCELLED, OrderStatus.DELIVERED];
        if (restrictedStatuses.includes(existingOrder.status)) {
            throw new ApiError(`Order cannot be cancelled in ${existingOrder.status} state`, httpStatus.BAD_REQUEST,);
        }

        await tr.order.update({
            where: { id: orderId },
            data: { status: OrderStatus.CANCELLED }
        });

        await Promise.all(
            existingOrder.orderItems.map((item) =>
                tr.products.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            increment: item.quantity
                        }
                    }
                })
            )
        );
    }, {
        isolationLevel: "Serializable"
    });
};
export const orderService = {
    checkout,
    getMyOrders,
    getSingleOrder,
    cancelOrder
};