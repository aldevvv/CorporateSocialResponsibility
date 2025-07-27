// app/api/insights/budget-analysis/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  // Tambahkan otorisasi Admin di sini jika perlu
  try {
    // 1. Ambil semua program beserta proposal dan laporannya
    const programs = await prisma.program.findMany({
      include: {
        proposalAsal: true,
        laporanProgres: {
          where: {
            tipeLaporan: 'KEUANGAN',
          },
        },
      },
    });

    const analysis = programs.reduce((acc, program) => {
      const pilar = program.proposalAsal.pilar;
      const anggaran = Number(program.anggaranFinal);
      const realisasi = program.laporanProgres.reduce((sum, report) => {
        const data = report.data as { tipe?: string; jumlah?: number };
        return data.tipe === 'pengeluaran' ? sum + Number(data.jumlah) : sum;
      }, 0);

      if (!acc[pilar]) {
        acc[pilar] = { pilar: pilar.replace(/_/g, ' '), anggaran: 0, realisasi: 0 };
      }
      acc[pilar].anggaran += anggaran;
      acc[pilar].realisasi += realisasi;
      
      return acc;
    }, {} as Record<string, { pilar: string; anggaran: number; realisasi: number }>);

    return NextResponse.json(Object.values(analysis));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil data analisis' }, { status: 500 });
  }
}