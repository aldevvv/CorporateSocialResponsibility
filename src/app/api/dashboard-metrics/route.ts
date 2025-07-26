// app/api/dashboard-metrics/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  // Otorisasi Admin bisa ditambahkan di sini
  try {
    // 1. Metrik Kartu Utama
    const totalProgram = await prisma.program.count();
    const totalAnggaran = await prisma.program.aggregate({
      _sum: { anggaranFinal: true },
    });
    
    // 2. Agregasi Status Program
    const programByStatus = await prisma.program.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    // 3. Agregasi Anggaran per Pilar
    const budgetByPillar = await prisma.programProposal.groupBy({
        by: ['pilar'],
        _sum: {
            estimasiAnggaran: true
        }
    });

    // 4. Laporan Progres Terbaru
    const recentReports = await prisma.laporanProgres.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            program: { select: { judul: true } },
            createdBy: { select: { name: true } }
        }
    });

    // 5. Total Proposal yang diajukan
    const totalProposal = await prisma.programProposal.count();
    
    // 6. Proposal berdasarkan status
    const proposalByStatus = await prisma.programProposal.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    const metrics = {
      totalProgram,
      totalProposal,
      totalAnggaran: totalAnggaran._sum.anggaranFinal || 0,
      programByStatus: programByStatus.map(item => ({ 
        name: item.status, 
        value: item._count.id 
      })),
      proposalByStatus: proposalByStatus.map(item => ({ 
        name: item.status, 
        value: item._count.id 
      })),
      budgetByPillar: budgetByPillar.map(item => ({ 
        name: item.pilar.replace(/_/g, ' '), 
        value: Number(item._sum.estimasiAnggaran) 
      })),
      recentReports
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil metrik dashboard' }, { status: 500 });
  }
}