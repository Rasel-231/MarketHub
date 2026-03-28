-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "isSupport" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "specifications" SET DEFAULT '[]';
