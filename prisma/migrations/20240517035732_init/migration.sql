/*
  Warnings:

  - You are about to drop the `Framework` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Framework" DROP CONSTRAINT "Framework_projectId_fkey";

-- DropTable
DROP TABLE "Framework";

-- CreateTable
CREATE TABLE "ChatResponse" (
    "id" SERIAL NOT NULL,
    "request" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatResponse_pkey" PRIMARY KEY ("id")
);
