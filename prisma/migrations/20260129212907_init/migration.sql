/*
  Warnings:

  - You are about to drop the column `paymentStatus` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `orders` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'FAILD';

-- DropIndex
DROP INDEX "orders_transactionId_key";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "paymentStatus",
DROP COLUMN "transactionId";
