// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
// import config from "../../config";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(process.cwd(), "/uploads"));
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// });

// const upload = multer({ storage: storage }).array("products_images", 10);

// const uploadToCloudinary = async (file: Express.Multer.File): Promise<UploadApiResponse | undefined> => {
//     cloudinary.config({
//         cloud_name: config.cloud_name,
//         api_key: config.api_key,
//         api_secret: config.api_secret
//     });

//     try {
//         const uploadResult = await cloudinary.uploader.upload(file.path, {
//             public_id: file.filename,

//         });

//         // আপলোড শেষে লোকাল ফাইল ডিলিট করা
//         if (fs.existsSync(file.path)) {
//             fs.unlinkSync(file.path);
//         }

//         return uploadResult;
//     } catch (error) {
//         if (fs.existsSync(file.path)) {
//             fs.unlinkSync(file.path);
//         }

//     }
// };

// export const fileUploader = {
//     upload,
//     uploadToCloudinary
// };

import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import config from "../../config";

// Cloudinary configuration
cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(process.cwd(), "/uploads");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // ফাইল রিপ্লেস হওয়া রোধ করতে টাইমস্ট্যাম্প যোগ করা হয়েছে
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// মাল্টিপল ইমেজ আপলোড কনফিগারেশন
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // ১০ এমবি লিমিট
}).array("products_images", 10);

const uploadToCloudinary = async (file: Express.Multer.File): Promise<UploadApiResponse | undefined> => {
    try {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
            public_id: file.filename,
            folder: "products"
        });

        // আপলোড শেষে লোকাল ফাইল ডিলিট
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        return uploadResult;
    } catch (error) {
        // এরর হলেও লোকাল ফাইল ক্লিন করা
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        console.error("Cloudinary Upload Error:", error);
        return undefined;
    }
};

export const fileUploader = {
    upload,
    uploadToCloudinary
};