-- CreateTable
CREATE TABLE "banner_images" (
    "id" TEXT NOT NULL,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banner_images_pkey" PRIMARY KEY ("id")
);
