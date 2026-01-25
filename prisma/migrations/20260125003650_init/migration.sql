/*
  Warnings:

  - You are about to drop the column `phone` on the `sellers` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `sellers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sellers" DROP COLUMN "phone",
DROP COLUMN "status";

-- DropEnum
DROP TYPE "SellerStatus";
