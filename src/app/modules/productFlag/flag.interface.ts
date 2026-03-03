import { Products, Review } from '@prisma/client';
export type ProductPrice = Products & {
    review?: Review[];
    sellingPrice: number;
    discountAmount: number;
}; 