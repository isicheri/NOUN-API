-- CreateEnum
CREATE TYPE "public"."NewsCategory" AS ENUM ('NEWSUPDATE', 'GUIDES', 'SCHOLARSHIP');

-- CreateTable
CREATE TABLE "public"."News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "public"."NewsCategory" NOT NULL DEFAULT 'NEWSUPDATE',
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NewsComment" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "newsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Quotes" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quotes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."NewsComment" ADD CONSTRAINT "NewsComment_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "public"."News"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
