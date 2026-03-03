-- AlterTable
ALTER TABLE "products" ADD COLUMN     "specifications" JSONB DEFAULT '{}';

-- CreateTable
CREATE TABLE "category_attributes" (
    "id" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "options" TEXT[],
    "type" TEXT NOT NULL DEFAULT 'text',
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "category_attributes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "category_attributes" ADD CONSTRAINT "category_attributes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
