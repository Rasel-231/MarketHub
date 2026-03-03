import { OrderStatus, Review, UserRole } from "@prisma/client";
import { IReview } from "./review.interface";
import { prisma } from "../../shared/prisma";
import httpStatus from 'http-status';
import ApiError from "../../shared/ApiError";

const createReview = async (userId: string | undefined, payload: IReview): Promise<Review> => {


    if (!payload) {
        throw new ApiError("Payload is missing!", httpStatus.BAD_REQUEST,);
    }
    const result = await prisma.review.create({
        data: {
            rating: payload.rating,
            comment: payload.comment,
            productId: payload.productId,
            userId: userId || null,
        }
    });
    return result;
};

const getAllReviews = async (productId: string): Promise<Review[]> => {
    const result = await prisma.review.findMany({
        where: {
            productId: productId
        },
        include: {
            user: {

                include: {
                    seller: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return result;
};

export const reviewService = {
    createReview,
    getAllReviews
};