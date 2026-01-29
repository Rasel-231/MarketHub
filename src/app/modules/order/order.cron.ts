import cron from 'node-cron';
import { prisma } from '../../shared/prisma';
import { OrderStatus, PaymentStatus } from '@prisma/client';

const startOrderCleanupCron = () => {

    cron.schedule('*/15 * * * *', async () => {
        console.log('--- আনপেইড অর্ডারের স্টক রিস্টোর প্রসেস শুরু হচ্ছে ---');

        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

        const expiredOrders = await prisma.order.findMany({
            where: {
                status: OrderStatus.PENDING,
                createdAt: { lte: thirtyMinutesAgo },
                payment: {
                    some: { paymentStatus: PaymentStatus.UNPAID }
                }
            },
            include: { orderItems: true }
        });

        if (expiredOrders.length === 0) return;

        for (const order of expiredOrders) {
            try {
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
                console.log(`অর্ডার ${order.id} ক্যানসেল এবং স্টক রিস্টোর হয়েছে।`);
            } catch (error) {
                console.error(`অর্ডার ${order.id} প্রসেসিং এরর:`, error);
            }
        }
    });
};

export default startOrderCleanupCron;