import { Message, Prisma } from '@prisma/client';
import { prisma } from '../../shared/prisma';
import { sendEmail } from '../../utils/Email/SendMailer';

const createContact = async (contactData: Prisma.MessageCreateInput): Promise<Message> => {
    const result = await prisma.message.create({
        data: contactData
    });
    return result;
};
const supportReply = async (contactData: Prisma.MessageCreateInput): Promise<Message> => {
    const result = await prisma.message.create({
        data: {
            ...contactData,
            isSupport: true
        }

    });

    const emailBody = `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <h2>Hi ${result.name},</h2>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 5px solid #10b981; margin: 20px 0;">
                ${result.message}
            </div>
            <p>If you have further questions, feel free to reply to this email.</p>
            <br/>
            <p>Best Regards,<br/><strong>MarketHub Support Team</strong></p>
        </div>
    `;

    await sendEmail(
        result.email,
        "Update regarding your inquiry - MarketHub",
        emailBody
    );

    return result;
};


const getSingleMessage = async (id: string): Promise<Message | null> => {
    const result = await prisma.message.findUnique({
        where: { id }
    });
    return result;
};

const deleteMessage = async (id: string): Promise<Message | null> => {
    const result = await prisma.message.delete({
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
    deleteMessage,
    supportReply
};