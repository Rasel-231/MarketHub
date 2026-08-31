// ============================================================
// CLOUDINARY UPLOAD HELPER
// ============================================================
// PDF buffer ke Cloudinary te upload kore, URL ferot dey.
// SAME public_id (invoiceNumber) use kore, tai 2nd bar upload
// korle eta notun file na hoye purono file-take "overwrite" kore.

import { v2 as cloudinary } from "cloudinary";
import config from "../../config";

cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret,
});

export function uploadInvoiceToCloudinary(
    buffer: Buffer,
    invoiceNumber: string
): Promise<string> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                // 'raw' resource_type PDF/non-image file-er jonno sothik
                resource_type: "raw",

                // Shob invoice ek folder-e organize
                folder: "invoices",

                // SAME invoiceNumber = same public_id -> overwrite hobe
                // Eta-i orphan file toiri howa thekay
                public_id: invoiceNumber,

                overwrite: true,

                // CDN-e purono cached version thakle seta invalidate kore
                // Na dile customer kisu shomoy purono "UNPAID" PDF dekhte pare
                invalidate: true,

                format: "pdf",
            },
            (error, result) => {
                if (error || !result) {
                    return reject(error);
                }
                resolve(result.secure_url);
            }
        );

        uploadStream.end(buffer);
    });
}

// ============================================================
// DELETE HELPER (cleanup job-e use hobe, retention period pore)
// ============================================================
export async function deleteInvoiceFromCloudinary(invoiceNumber: string): Promise<void> {
    await cloudinary.uploader.destroy(`invoices/${invoiceNumber}`, {
        resource_type: "raw",
        invalidate: true,
    });
}
