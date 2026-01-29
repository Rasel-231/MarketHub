import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import ApiError from "../../shared/ApiError";
import { prisma } from "../../shared/prisma";
import httpStatus from "http-status";
import { v4 as uuidv4 } from 'uuid';
import { paymentService } from "../payment/payment.service";

const checkout = async (userId: string, payload: { deliveryAddress: string }) => {
    const result = await prisma.$transaction(async (tx) => {
        const existingCart = await tx.cart.findUnique({
            where: { userId },
            include: {
                items: { include: { product: true } },
                user: true
            }
        });

        if (!existingCart || existingCart.items.length === 0) {
            throw new ApiError("আপনার কার্ট খালি!", httpStatus.BAD_REQUEST);
        }

        // স্টক চেক এবং কমানো
        for (const item of existingCart.items) {
            if (item.product.stock < item.quantity) {
                throw new ApiError(
                    `${item.product.title} পর্যাপ্ত স্টকে নেই।`,
                    httpStatus.BAD_REQUEST
                );
            }

            await tx.products.update({
                where: { id: item.productId },
                data: { stock: { decrement: item.quantity } }
            });
        }

        const totalAmount = existingCart.items.reduce(
            (acc, item) => acc + (item.quantity * item.price), 0
        );

        const createOrder = await tx.order.create({
            data: {
                userId,
                totalAmount,
                deliveryAddress: payload.deliveryAddress,
                status: OrderStatus.PENDING,
                orderItems: {
                    create: existingCart.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.price
                    }))
                }
            }
        });

        const transactionId = uuidv4();

        await tx.payment.create({
            data: {
                orderId: createOrder.id,
                userId: userId,
                amount: totalAmount,
                transactionId: transactionId,
                paymentMethod: PaymentMethod.ONLINE,
                paymentStatus: PaymentStatus.UNPAID
            }
        });

        await tx.cartItem.deleteMany({
            where: { cartId: existingCart.id }
        });

        return {
            amount: totalAmount,
            transactionId,
            name: existingCart.user?.name,
            email: existingCart.user?.email,
            contactNumber: existingCart.user?.contactNumber,
            address: payload.deliveryAddress
        };
    });

    const paymentUrl = await paymentService.initiatePaymentService(result);

    return { paymentUrl };
};

const getMyOrders = async (userId: string) => {
    return await prisma.order.findMany({
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
    return await prisma.order.findFirstOrThrow({
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
    await prisma.$transaction(async (tr) => {
        const existingOrder = await tr.order.findUnique({
            where: { id: orderId },
            include: { orderItems: true }
        });

        if (!existingOrder) {
            throw new ApiError("অর্ডারটি পাওয়া যায়নি", httpStatus.NOT_FOUND);
        }

        if (existingOrder.userId !== userId) {
            throw new ApiError("আপনার এই অর্ডারটি বাতিল করার অনুমতি নেই", httpStatus.FORBIDDEN);
        }

        const restrictedStatuses: OrderStatus[] = [OrderStatus.CANCELLED, OrderStatus.DELIVERED];
        if (restrictedStatuses.includes(existingOrder.status)) {
            throw new ApiError(`অর্ডারটি ইতিমধ্যে ${existingOrder.status} অবস্থায় আছে, তাই বাতিল করা যাবে না।`, httpStatus.BAD_REQUEST);
        }

        await tr.order.update({
            where: { id: orderId },
            data: { status: OrderStatus.CANCELLED }
        });

        // স্টক ফিরিয়ে দেওয়া
        for (const item of existingOrder.orderItems) {
            await tr.products.update({
                where: { id: item.productId },
                data: {
                    stock: { increment: item.quantity }
                }
            });
        }
    });
};

export const orderService = {
    checkout,
    getMyOrders,
    getSingleOrder,
    cancelOrder
};