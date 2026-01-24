/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `sellers` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `sellers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "sellers" DROP COLUMN "isActive",
DROP COLUMN "isDeleted";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;
