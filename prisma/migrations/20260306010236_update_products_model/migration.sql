/*
  Warnings:

  - You are about to drop the column `colour` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "colour",
DROP COLUMN "model",
DROP COLUMN "size";
