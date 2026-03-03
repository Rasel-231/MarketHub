
import ApiError from "../shared/ApiError";
import httpStatus from 'http-status';
export const calculateDiscount = (
    productActualPrice: number,
    discountedRate: number
) => {

    if (isNaN(productActualPrice) || productActualPrice <= 0) {
        throw new ApiError("Invalid product price", httpStatus.BAD_REQUEST);
    }

    if (isNaN(discountedRate) || discountedRate < 0 || discountedRate > 100) {
        throw new ApiError("Invalid discount rate", httpStatus.BAD_REQUEST);
    }

    const discountAmount = (productActualPrice * discountedRate) / 100;
    const sellingPrice = productActualPrice - discountAmount;

    return {
        discountAmount: Number(discountAmount.toFixed(2)),
        sellingPrice: Number(sellingPrice.toFixed(2)),
    };
};