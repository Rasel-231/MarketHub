/*
  Warnings:

  - You are about to drop the column `discountAmount` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sellingPrice` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "discountAmount",
DROP COLUMN "sellingPrice";
