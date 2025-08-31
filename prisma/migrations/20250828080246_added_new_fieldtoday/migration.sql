/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `PDF` table. All the data in the column will be lost.
  - Added the required column `fileKey` to the `PDF` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."PDF" DROP COLUMN "fileUrl",
ADD COLUMN     "fileKey" TEXT NOT NULL;
