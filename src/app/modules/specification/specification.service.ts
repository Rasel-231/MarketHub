import { prisma } from "../../shared/prisma"

interface ISpecification {
    categoryName: string;
    details: string;
}

const createSpecification = async (data: ISpecification, productId: string) => {
    const { categoryName, details } = data;
    const product = await prisma.products.findUniqueOrThrow({
        where: { id: productId }
    });
    const existingSpecs = (product.specifications as Record<string, any>) || {};

    const updatedSpecs = {
        ...existingSpecs,
        [categoryName]: details
    };
    const result = await prisma.products.update({
        where: { id: productId },
        data: {
            specifications: updatedSpecs
        }
    });

    return result;
}

export const specificationService = {
    createSpecification
}