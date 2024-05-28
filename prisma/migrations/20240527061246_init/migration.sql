-- CreateTable
CREATE TABLE "ChatResponse" (
    "id" SERIAL NOT NULL,
    "request" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChatResponse" ADD CONSTRAINT "ChatResponse_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
