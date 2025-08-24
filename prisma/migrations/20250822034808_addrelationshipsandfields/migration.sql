/*
  Warnings:

  - You are about to drop the column `amount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `pdfId` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `PDF` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."PdfCategory" AS ENUM ('PROJECT_SEMINAR', 'COURSE_SUMMARY', 'TMA_ARCHIVE', 'PAST_QUESTIONS', 'COURSE_MATERIAL');

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_pdfId_fkey";

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "amount",
DROP COLUMN "pdfId",
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "public"."PDF" ADD COLUMN     "category" "public"."PdfCategory" NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'local',
ADD COLUMN     "providerId" TEXT,
ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "pdfId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cart" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CartItem" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "pdfId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_pdfId_key" ON "public"."CartItem"("cartId", "pdfId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrderItem" ADD CONSTRAINT "OrderItem_pdfId_fkey" FOREIGN KEY ("pdfId") REFERENCES "public"."PDF"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "public"."Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CartItem" ADD CONSTRAINT "CartItem_pdfId_fkey" FOREIGN KEY ("pdfId") REFERENCES "public"."PDF"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
