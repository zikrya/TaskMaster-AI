-- CreateTable
CREATE TABLE "Framework" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "Framework_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Framework" ADD CONSTRAINT "Framework_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
