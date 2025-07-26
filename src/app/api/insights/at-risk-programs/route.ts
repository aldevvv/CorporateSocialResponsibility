// app/api/insights/at-risk-programs/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Ambil semua program yang sedang berjalan
    const runningPrograms = await prisma.program.findMany({
      where: { status: 'BERJALAN' },
      include: {
        penanggungJawab: { select: { name: true } },
        // Ambil hanya 1 laporan progres terbaru untuk setiap program
        laporanProgres: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 2. Filter program yang berisiko
    const atRiskPrograms = runningPrograms.filter(program => {
      if (program.laporanProgres.length === 0) {
        // Jika belum ada laporan sama sekali, dan program dibuat > 30 hari lalu
        return program.createdAt < thirtyDaysAgo;
      }
      // Jika laporan terakhirnya lebih dari 30 hari yang lalu
      return program.laporanProgres[0].createdAt < thirtyDaysAgo;
    });

    return NextResponse.json(atRiskPrograms);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil data program berisiko' }, { status: 500 });
  }
}