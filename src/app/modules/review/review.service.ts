import { OrderStatus, Review, UserRole } from "@prisma/client";
import { IReview } from "./review.interface";
import { prisma } from "../../shared/prisma";
import httpStatus from "http-status"
import ApiError from "../../shared/ApiError";

const createReview = async (userId: string, payload: IReview): Promise<Review> => {
    const isDelivered = await prisma.order.findFirst({
        where: {
            userId,
            status: OrderStatus.DELIVERED,
            orderItems: {
                some: {
                    productId: payload.productId
                }
            }
        }


    })
    if (!isDelivered) {
        throw new ApiError("You can only review products that have been delivered to you", httpStatus.BAD_REQUEST,
        );
    }

    const result = await prisma.review.create({
        data: {
            userId,
            productId: payload.productId,
            rating: payload.rating,
            comment: payload.comment
        }
    })
    return result;
}

export const reviewService = {
    createReview
};