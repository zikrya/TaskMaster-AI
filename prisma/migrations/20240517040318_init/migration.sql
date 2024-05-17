/*
  Warnings:

  - Added the required column `projectId` to the `ChatResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatResponse" ADD COLUMN     "projectId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ChatResponse" ADD CONSTRAINT "ChatResponse_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
