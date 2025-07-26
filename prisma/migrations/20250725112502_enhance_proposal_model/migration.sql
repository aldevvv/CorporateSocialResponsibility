/*
  Warnings:

  - Added the required column `estimasiAnggaran` to the `ProgramProposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `indikatorKeberhasilan` to the `ProgramProposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jumlahPenerimaManfaat` to the `ProgramProposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lokasiKabupaten` to the `ProgramProposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lokasiKecamatan` to the `ProgramProposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `perkiraanMulai` to the `ProgramProposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `perkiraanSelesai` to the `ProgramProposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pilar` to the `ProgramProposal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetPenerimaManfaat` to the `ProgramProposal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TjslPillar" AS ENUM ('PENDIDIKAN', 'LINGKUNGAN', 'PENGEMBANGAN_UMK', 'SOSIAL_BUDAYA');

-- AlterEnum
ALTER TYPE "ProposalStatus" ADD VALUE 'SELESAI';

-- AlterTable
ALTER TABLE "ProgramProposal" ADD COLUMN     "estimasiAnggaran" DECIMAL(15,2) NOT NULL,
ADD COLUMN     "indikatorKeberhasilan" TEXT NOT NULL,
ADD COLUMN     "jumlahPenerimaManfaat" INTEGER NOT NULL,
ADD COLUMN     "lokasiDesa" TEXT,
ADD COLUMN     "lokasiKabupaten" TEXT NOT NULL,
ADD COLUMN     "lokasiKecamatan" TEXT NOT NULL,
ADD COLUMN     "perkiraanMulai" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "perkiraanSelesai" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "pilar" "TjslPillar" NOT NULL,
ADD COLUMN     "ringkasan" TEXT,
ADD COLUMN     "targetPenerimaManfaat" TEXT NOT NULL;
