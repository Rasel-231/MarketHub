import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from 'http-status';
import { wishlistService } from "./wishlist.Service";

const addWishlist = catchAsync(async (req: Request, res: Response) => {
    const result = await wishlistService.addWishlist(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Products added to wishlist successfully",
        data: result,
    });
})
const deleteWishlist = catchAsync(async (req: Request, res: Response) => {
    const wishlistId = req?.params?.wishlistId;
    const result = await wishlistService.removeFromWishlist(wishlistId as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Products deleted from wishlist successfully",
        data: result,
    });
})
const getWishlist = catchAsync(async (req: Request, res: Response) => {

    const result = await wishlistService.getMyWishlist();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Products retrieved from wishlist successfully",
        data: result,
    });
})

export const wishlistController = {
    addWishlist,
    deleteWishlist,
    getWishlist,

}

// export const wishlistController = {
//   // ১. উইশলিস্টে প্রোডাক্ট যোগ করা
//   addToWishlist: async (req: Request, res: Response) => {
//     try {
//       const { userId, productId } = req.body;

//       // চেক করা: অলরেডি উইশলিস্টে আছে কি না
//       const existing = await prisma.wishlist.findFirst({
//         where: { userId, productId },
//       });

//       if (existing) {
//         return res.status(400).json({ message: "প্রোডাক্টটি অলরেডি উইশলিস্টে আছে।" });
//       }

//       const result = await prisma.wishlist.create({
//         data: { userId, productId },
//       });

//       res.status(201).json({ message: "উইশলিস্টে যোগ হয়েছে", data: result });
//     } catch (error) {
//       res.status(500).json({ error: "সার্ভার এরর" });
//     }
//   },

//   // ২. নির্দিষ্ট ইউজারের উইশলিস্ট দেখা
//   getWishlist: async (req: Request, res: Response) => {
//     try {
//       const { userId } = req.params;

//       const wishlist = await prisma.wishlist.findMany({
//         where: { userId },
//         include: {
//           product: true, // প্রোডাক্টের সব তথ্য সহ আসবে
//         },
//       });

//       res.status(200).json({ data: wishlist });
//     } catch (error) {
//       res.status(500).json({ error: "সার্ভার এরর" });
//     }
//   },

//   // ৩. উইশলিস্ট থেকে ডিলিট করা
//   removeFromWishlist: async (req: Request, res: Response) => {
//     try {
//       const { id } = req.params; // Wishlist entry ID

//       await prisma.wishlist.delete({
//         where: { id },
//       });

//       res.status(200).json({ message: "উইশলিস্ট থেকে মুছে ফেলা হয়েছে" });
//     } catch (error) {
//       res.status(500).json({ error: "ডিলিট করতে সমস্যা হয়েছে" });
//     }
//   },
// };