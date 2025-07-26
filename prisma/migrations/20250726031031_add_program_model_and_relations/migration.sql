-- CreateEnum
CREATE TYPE "ProgramStatus" AS ENUM ('BERJALAN', 'SELESAI', 'DITUNDA', 'DIBATALKAN');

-- AlterEnum
ALTER TYPE "ProposalStatus" ADD VALUE 'DIJALANKAN';

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "pilar" "TjslPillar" NOT NULL,
    "lokasiKabupaten" TEXT NOT NULL,
    "lokasiKecamatan" TEXT NOT NULL,
    "latarBelakang" TEXT NOT NULL,
    "tujuanProgram" TEXT NOT NULL,
    "indikatorKeberhasilan" TEXT NOT NULL,
    "targetPenerimaManfaat" TEXT NOT NULL,
    "jumlahPenerimaManfaat" INTEGER NOT NULL,
    "anggaranFinal" DECIMAL(15,2) NOT NULL,
    "tanggalMulaiFinal" TIMESTAMP(3) NOT NULL,
    "tanggalSelesaiFinal" TIMESTAMP(3) NOT NULL,
    "penanggungJawabId" TEXT NOT NULL,
    "status" "ProgramStatus" NOT NULL DEFAULT 'BERJALAN',
    "proposalAsalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Program_proposalAsalId_key" ON "Program"("proposalAsalId");

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_penanggungJawabId_fkey" FOREIGN KEY ("penanggungJawabId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_proposalAsalId_fkey" FOREIGN KEY ("proposalAsalId") REFERENCES "ProgramProposal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
