-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_chatResponseId_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "customTicketId" INTEGER,
ALTER COLUMN "chatResponseId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_chatResponseId_fkey" FOREIGN KEY ("chatResponseId") REFERENCES "ChatResponse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_customTicketId_fkey" FOREIGN KEY ("customTicketId") REFERENCES "CustomTicket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
