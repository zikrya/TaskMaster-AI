-- AlterTable
ALTER TABLE "ChatResponse" ADD COLUMN     "assigneeId" TEXT;

-- AlterTable
ALTER TABLE "CustomTicket" ADD COLUMN     "assigneeId" TEXT;

-- AddForeignKey
ALTER TABLE "ChatResponse" ADD CONSTRAINT "ChatResponse_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomTicket" ADD CONSTRAINT "CustomTicket_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
