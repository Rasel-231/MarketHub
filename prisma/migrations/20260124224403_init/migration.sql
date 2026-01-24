/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isActive";
