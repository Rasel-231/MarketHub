import { OrderStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma";

const getAllOrders = async () => {
    return await prisma.order.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            orderItems: {
                include: {
                    product: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
};

const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    return await prisma.order.update({
        where: {
            id: orderId
        },
        data: {
            status
        }
    });
};

export const adminService = {
    getAllOrders,
    updateOrderStatus
};