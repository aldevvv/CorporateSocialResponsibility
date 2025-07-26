-- CreateEnum
CREATE TYPE "DokumenType" AS ENUM ('MoU', 'PKS', 'SURAT_RESMI', 'DOKUMENTASI', 'LAINNYA');

-- CreateTable
CREATE TABLE "DokumenProgram" (
    "id" TEXT NOT NULL,
    "namaDokumen" TEXT NOT NULL,
    "tipeDokumen" "DokumenType" NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileContent" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DokumenProgram_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DokumenProgram" ADD CONSTRAINT "DokumenProgram_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DokumenProgram" ADD CONSTRAINT "DokumenProgram_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
