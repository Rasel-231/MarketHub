import axios from 'axios';
import config from '../../../config';
import ApiError from '../../shared/ApiError';
import httpStatus from "http-status";
import { prisma } from '../../shared/prisma';
import { ProductStatus } from '@prisma/client';
import { calculateDiscount } from '../calculateFn';
const chatWithAi = async (payload: { prompt: string; userId?: string }) => {

    if (!payload?.prompt) {
        throw new ApiError("Prompt is required", httpStatus.BAD_REQUEST);
    }

    let userName = "Guest";
    if (payload.userId) {
        const user = await prisma.user.findUnique({ where: { id: payload.userId } });
        if (user) userName = user.name || "Boss";
    }

    const products = await prisma.products.findMany({
        where: { status: ProductStatus.AVAILABLE },
        select: {
            title: true,
            productActualPrice: true,
            discountedRate: true,
            brand: true,
            category: { select: { name: true } }
        },
        take: 15
    });


    const mappedProducts = products.map((product: any) => {
        const { sellingPrice } = (calculateDiscount as any)(
            product.productActualPrice,
            product.discountedRate
        );

        return {
            title: product.title,
            brand: product.brand,
            category: product.category?.name,
            originalPrice: product.productActualPrice,
            discount: `${product.discountedRate}%`,
            sellingPrice: sellingPrice
        };
    });

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "google/gemini-2.0-flash-001",
                messages: [
                    {
                        role: "system",
                        content: `You are a helpful shopping assistant for MarketHub. 
                        The user's name is ${userName}.
                        Available Products: ${JSON.stringify(mappedProducts)}.
                        Always mention the 'sellingPrice' when discussing costs.
                        Be polite and help the user find the best deals.`
                    },
                    { role: "user", content: payload.prompt }
                ],
            },
            {
                headers: {
                    "Authorization": `Bearer ${config.ai_api_key}`,
                    "Content-Type": "application/json",
                }
            }
        );

        return {
            reply: response.data.choices[0].message.content,
            userName
        };
    } catch (error: any) {
        console.error("AI Error:", error.response?.data || error.message);
        throw new ApiError("AI Assistant is currently unavailable", httpStatus.SERVICE_UNAVAILABLE);
    }
};

export const AIService = { chatWithAi };