-- AlterTable
ALTER TABLE "products" ADD COLUMN     "flashSaleEnd" TIMESTAMP(3),
ADD COLUMN     "flashSalePrice" DECIMAL(65,30),
ADD COLUMN     "flashSaleStart" TIMESTAMP(3),
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "_ProductRelations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductRelations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProductRelations_B_index" ON "_ProductRelations"("B");

-- AddForeignKey
ALTER TABLE "_ProductRelations" ADD CONSTRAINT "_ProductRelations_A_fkey" FOREIGN KEY ("A") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductRelations" ADD CONSTRAINT "_ProductRelations_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
