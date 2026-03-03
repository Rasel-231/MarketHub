import { Request } from "express";
import { fileUploader } from "../helpers/fileUploader";

export const uploadImage = async (req: Request) => {
    if (req.file) {
        const uploadedResult = await fileUploader.uploadToCloudinary(req.file);
        return uploadedResult?.secure_url;
    }
    return null;
};


