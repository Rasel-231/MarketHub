/*
  Warnings:

  - The values [Pending,Processing,Shipped,Delivered,Cancelled] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [CashOnDelivery,OnlinePayment,PartialPayment] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.
  - The values [Paid,Unpaid,Refunded] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [Available,StockOut,Upcoming] on the enum `ProductStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [Buyer,Admin,Seller] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - The values [Active,suspended,pending] on the enum `UserStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `CategoryName` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `categoryName` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `guestContact` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `guestContactNumber` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `guestEmail` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `guestName` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `ProductsName` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `profilePhoto` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shopSlug]` on the table `sellers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopName` to the `sellers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopSlug` to the `sellers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SellerStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ShippingMethod" AS ENUM ('STANDARD', 'EXPRESS', 'OVERNIGHT');

-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED');
ALTER TABLE "public"."orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('CASH_ON_DELIVERY', 'ONLINE');
ALTER TABLE "public"."orders" ALTER COLUMN "paymentMethod" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "paymentMethod" TYPE "PaymentMethod_new" USING ("paymentMethod"::text::"PaymentMethod_new");
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "public"."PaymentMethod_old";
ALTER TABLE "orders" ALTER COLUMN "paymentMethod" SET DEFAULT 'CASH_ON_DELIVERY';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('UNPAID', 'PAID', 'REFUNDED');
ALTER TABLE "public"."orders" ALTER COLUMN "paymentStatus" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "paymentStatus" TYPE "PaymentStatus_new" USING ("paymentStatus"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "orders" ALTER COLUMN "paymentStatus" SET DEFAULT 'UNPAID';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ProductStatus_new" AS ENUM ('AVAILABLE', 'OUT_OF_STOCK', 'DISCONTINUED');
ALTER TABLE "public"."products" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "products" ALTER COLUMN "status" TYPE "ProductStatus_new" USING ("status"::text::"ProductStatus_new");
ALTER TYPE "ProductStatus" RENAME TO "ProductStatus_old";
ALTER TYPE "ProductStatus_new" RENAME TO "ProductStatus";
DROP TYPE "public"."ProductStatus_old";
ALTER TABLE "products" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('BUYER', 'SELLER', 'ADMIN');
ALTER TABLE "public"."users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'BUYER';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserStatus_new" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');
ALTER TABLE "public"."users" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "status" TYPE "UserStatus_new" USING ("status"::text::"UserStatus_new");
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "public"."UserStatus_old";
ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "CategoryName",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "categoryName",
DROP COLUMN "guestContact",
DROP COLUMN "guestContactNumber",
DROP COLUMN "guestEmail",
DROP COLUMN "guestName",
DROP COLUMN "productName",
DROP COLUMN "quantity",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "paymentStatus" SET DEFAULT 'UNPAID',
ALTER COLUMN "paymentMethod" SET DEFAULT 'CASH_ON_DELIVERY';

-- AlterTable
ALTER TABLE "products" DROP COLUMN "ProductsName",
DROP COLUMN "profilePhoto",
ADD COLUMN     "brand" TEXT NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stock" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE "sellers" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "shopName" TEXT NOT NULL,
ADD COLUMN     "shopSlug" TEXT NOT NULL,
ADD COLUMN     "status" "SellerStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'BUYER',
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "carts_sessionId_key" ON "carts"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "carts_userId_key" ON "carts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sellers_shopSlug_key" ON "sellers"("shopSlug");

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
