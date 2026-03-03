import { Message, Prisma } from '@prisma/client';
import { prisma } from '../../shared/prisma';

const createContact = async (contactData: Prisma.MessageCreateInput): Promise<Message> => {
    const result = await prisma.message.create({
        data: contactData
    });
    return result;
};


const getSingleMessage = async (id: string): Promise<Message | null> => {
    const result = await prisma.message.findUnique({
        where: { id }
    });
    return result;
};

const deleteMessage = async (id: string): Promise<Message | null> => {
    const result = await prisma.message.findUnique({
        where: { id }
    });
    return result;
};


const getAllMessages = async (): Promise<Message[]> => {
    const result = await prisma.message.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
    return result;
};

export const contactService = {
    createContact,
    getSingleMessage,
    getAllMessages,
    deleteMessage
};