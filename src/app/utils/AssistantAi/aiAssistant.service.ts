import axios from 'axios';
import config from '../../../config';
import ApiError from '../../shared/ApiError';
import httpStatus from "http-status";
import { prisma } from '../../shared/prisma';
import { ProductStatus } from '@prisma/client';

const chatWithAi = async (payload: { prompt: string; userId?: string }) => {

    console.log("UserId", payload.userId);
    if (!payload?.prompt) {
        throw new ApiError("Prompt is required", httpStatus.BAD_REQUEST);
    }

    // 1. Fetch User details for personalization
    let userName = "Guest";
    if (payload.userId) {
        const user = await prisma.user.findUnique({ where: { id: payload.userId } });
        if (user) userName = user.name || user.name || "Boss";
    }

    // 2. Fetch Available Products
    const products = await prisma.products.findMany({
        where: { status: ProductStatus.AVAILABLE },
        select: {
            title: true,
            price: true,
            description: true,
            brand: true,
            category: { select: { name: true } }
        }
    });

    // 3. Direct API Call to OpenRouter
    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "google/gemini-2.0-flash-001",
                messages: [
                    {
                        role: "system",
                        content: `You are a helpful shopping assistant for our e-commerce store. 
                        The user's name is ${userName}.
                        Here is our catalog: ${JSON.stringify(products)}.
                        If the user is logged in (name is not Guest), greet them by name.
                        Help them find products, compare prices, and be very polite.`
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