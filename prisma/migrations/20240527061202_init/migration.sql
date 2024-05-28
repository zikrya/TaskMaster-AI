/*
  Warnings:

  - You are about to drop the `ChatResponse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatResponse" DROP CONSTRAINT "ChatResponse_projectId_fkey";

-- DropTable
DROP TABLE "ChatResponse";
