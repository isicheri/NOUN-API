-- CreateTable
CREATE TABLE "public"."AcademicEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "target" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AcademicEvent_pkey" PRIMARY KEY ("id")
);
