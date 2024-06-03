/*
  Warnings:

  - You are about to drop the column `parentId` on the `ChatResponse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChatResponse" DROP COLUMN "parentId",
ADD COLUMN     "description" TEXT;
