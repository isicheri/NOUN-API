/*
  Warnings:

  - A unique constraint covering the columns `[paymentId]` on the table `CourseSummaryRequest` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[paymentId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED');

-- AlterTable
ALTER TABLE "public"."CourseSummaryRequest" ADD COLUMN     "paymentId" TEXT;

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "paymentId" TEXT;

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "reference" TEXT NOT NULL,
    "gateway" TEXT NOT NULL DEFAULT 'paystack',
    "userId" TEXT,
    "orderId" TEXT,
    "requestId" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_reference_key" ON "public"."Payment"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "public"."Payment"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_requestId_key" ON "public"."Payment"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseSummaryRequest_paymentId_key" ON "public"."CourseSummaryRequest"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_paymentId_key" ON "public"."Order"("paymentId");

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "public"."CourseSummaryRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
