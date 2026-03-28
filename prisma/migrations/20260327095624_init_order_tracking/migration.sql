-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrderStatus" ADD VALUE 'ORDER_RECEIVED';
ALTER TYPE "OrderStatus" ADD VALUE 'ORDER_PACKED';
ALTER TYPE "OrderStatus" ADD VALUE 'SENT_TO_WAREHOUSE';
ALTER TYPE "OrderStatus" ADD VALUE 'RECEIVED_AT_WAREHOUSE';
ALTER TYPE "OrderStatus" ADD VALUE 'SENT_TO_DESTINATION';
ALTER TYPE "OrderStatus" ADD VALUE 'DESTINATION_RECEIVED';
ALTER TYPE "OrderStatus" ADD VALUE 'RIDER_ASSIGNED';
ALTER TYPE "OrderStatus" ADD VALUE 'OUT_FOR_DELIVERY';

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "riderName" TEXT,
ADD COLUMN     "riderPhone" TEXT;

-- CreateTable
CREATE TABLE "order_timelines" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_timelines_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order_timelines" ADD CONSTRAINT "order_timelines_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
