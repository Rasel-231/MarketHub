// @ts-ignore
import SSLCommerzPayment from 'sslcommerz-lts';
import { prisma } from '../../shared/prisma';
import { PaymentStatus, OrderStatus } from '@prisma/client';
import config from '../../../config';

const store_id = config.payment.store_id;
const store_passwd = config.payment.store_password;
const is_live = config.base_url === 'production';

const initiatePaymentService = async (payload: any) => {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);


    const data = {
        total_amount: payload.amount,
        currency: 'BDT',
        tran_id: payload.transactionId,
        success_url: `${config.base_url}/payment/success?tranId=${payload.transactionId}`,
        fail_url: `${config.base_url}/payment/fail?tranId=${payload.transactionId}`,
        cancel_url: `${config.base_url}/payment/cancel?tranId=${payload.transactionId}`,
        ipn_url: `${config.base_url}/payment/ipn`,
        shipping_method: 'NO',
        product_name: 'E-commerce Product',
        product_category: 'General',
        product_profile: 'general',
        cus_name: payload.name,
        cus_email: payload.email,
        cus_add1: payload.address,
        cus_phone: payload.contactNumber,
        cus_city: 'Dhaka',
        cus_country: 'Bangladesh',
    };

    const apiResponse = await sslcz.init(data);
    if (apiResponse?.GatewayPageURL) return apiResponse.GatewayPageURL;

    throw new Error('SSLCommerz initiation failed');
};

const validatePaymentService = async (payload: any) => {
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const validationResult = await sslcz.validate(payload);

    if (validationResult.status === 'VALID') {
        return await prisma.$transaction(async (tx) => {
            const updatedPayment = await tx.payment.update({
                where: { transactionId: validationResult.tran_id },
                data: { paymentStatus: PaymentStatus.PAID }
            });

            await tx.order.update({
                where: { id: updatedPayment.orderId },
                data: { status: OrderStatus.DELIVERED }
            });

            return { isValid: true };
        });
    }
    return { isValid: false };
};

const handleFailedPayment = async (tranId: string, status: PaymentStatus) => {
    await prisma.payment.update({
        where: { transactionId: tranId },
        data: { paymentStatus: status }
    });
};

export const paymentService = {
    initiatePaymentService,
    validatePaymentService,
    handleFailedPayment
};