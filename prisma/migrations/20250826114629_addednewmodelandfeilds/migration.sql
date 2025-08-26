-- AlterTable
ALTER TABLE "public"."PDF" ADD COLUMN     "isFree" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "price" SET DEFAULT 0.0;

-- CreateTable
CREATE TABLE "public"."Download" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pdfId" TEXT NOT NULL,
    "downloadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Download_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Download_userId_idx" ON "public"."Download"("userId");

-- CreateIndex
CREATE INDEX "Download_pdfId_idx" ON "public"."Download"("pdfId");

-- AddForeignKey
ALTER TABLE "public"."Download" ADD CONSTRAINT "Download_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Download" ADD CONSTRAINT "Download_pdfId_fkey" FOREIGN KEY ("pdfId") REFERENCES "public"."PDF"("id") ON DELETE CASCADE ON UPDATE CASCADE;
