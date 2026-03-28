import cron from 'node-cron';
import { prisma } from '../../shared/prisma';
import { OrderStatus, PaymentStatus } from '@prisma/client';

const startOrderCleanupCron = () => {
    cron.schedule('*/15 * * * *', async () => {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

        try {
            const expiredOrders = await prisma.order.findMany({
                where: {
                    status: OrderStatus.PENDING,
                    createdAt: { lte: thirtyMinutesAgo },
                    payment: {
                        paymentStatus: PaymentStatus.UNPAID
                    }
                },
                include: { orderItems: true }
            });

            if (expiredOrders.length === 0) return;

            for (const order of expiredOrders) {
                await prisma.$transaction(async (tx) => {
                    await tx.order.update({
                        where: { id: order.id },
                        data: { status: OrderStatus.CANCELLED }
                    });

                    for (const item of order.orderItems) {
                        await tx.products.update({
                            where: { id: item.productId },
                            data: { stock: { increment: item.quantity } }
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Cleanup error:', error);
        }
    });
};

export default startOrderCleanupCron;