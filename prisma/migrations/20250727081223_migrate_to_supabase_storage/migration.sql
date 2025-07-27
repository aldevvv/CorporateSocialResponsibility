/*
  Warnings:

  - You are about to drop the column `fileContent` on the `DokumenProgram` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `DokumenProgram` table. All the data in the column will be lost.
  - Added the required column `kunciFile` to the `DokumenProgram` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urlDokumen` to the `DokumenProgram` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DokumenProgram" DROP COLUMN "fileContent",
DROP COLUMN "mimeType",
ADD COLUMN     "kunciFile" TEXT NOT NULL,
ADD COLUMN     "urlDokumen" TEXT NOT NULL;
