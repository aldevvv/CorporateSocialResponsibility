-- CreateEnum
CREATE TYPE "LaporanType" AS ENUM ('PROGRES_RUTIN', 'PENCAPAIAN_MILESTONE', 'KEUANGAN', 'INSIDEN_KENDALA', 'KEGIATAN_KHUSUS');

-- CreateTable
CREATE TABLE "LaporanProgres" (
    "id" TEXT NOT NULL,
    "tipeLaporan" "LaporanType" NOT NULL,
    "data" JSONB NOT NULL,
    "programId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LaporanProgres_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LaporanProgres" ADD CONSTRAINT "LaporanProgres_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaporanProgres" ADD CONSTRAINT "LaporanProgres_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
