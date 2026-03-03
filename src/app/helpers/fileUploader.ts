import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import config from "../../config";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), "/uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (file: Express.Multer.File): Promise<UploadApiResponse | undefined> => {
    cloudinary.config({
        cloud_name: config.cloud_name,
        api_key: config.api_key,
        api_secret: config.api_secret
    });

    try {
        const uploadResult = await cloudinary.uploader.upload(file.path, {
            public_id: file.filename,

        });

        // আপলোড শেষে লোকাল ফাইল ডিলিট করা
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        return uploadResult;
    } catch (error) {
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

    }
};

export const fileUploader = {
    upload,
    uploadToCloudinary
};