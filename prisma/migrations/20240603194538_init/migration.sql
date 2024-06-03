/*
  Warnings:

  - You are about to drop the column `description` on the `ChatResponse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChatResponse" DROP COLUMN "description",
ADD COLUMN     "parentId" INTEGER;
