import { CategoryAttribute } from "@prisma/client";
import { prisma } from "../../shared/prisma";
import { IAttribute } from "./attribute.interface";

const createAttribute = async (payload: IAttribute): Promise<CategoryAttribute> => {
    const attributeData = {
        categoryId: payload.categoryId,
        groupName: payload.groupName || "",
        label: payload.label as string || ""
    };

    const result = await prisma.categoryAttribute.create({
        data: attributeData
    });

    return result;
};

const getAttributesByCategory = async (categoryId: string) => {
    return await prisma.categoryAttribute.findMany({
        where: { categoryId },
        orderBy: { groupName: 'asc' }
    });
};



export const attributeService = {
    createAttribute,
    getAttributesByCategory
};