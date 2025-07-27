// app/api/programs/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions) as { user?: { id: string; role: string; name?: string; email?: string } } | null;
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { proposal, anggaranFinal, tanggalMulaiFinal, tanggalSelesaiFinal, penanggungJawabId } = body;

    // Gunakan transaksi untuk memastikan kedua operasi berhasil atau gagal bersamaan
    const result = await prisma.$transaction(async (tx) => {
      // 1. Buat Program Resmi baru
      const newProgram = await tx.program.create({
        data: {
          judul: proposal.judul,
          pilar: proposal.pilar,
          lokasiKabupaten: proposal.lokasiKabupaten,
          lokasiKecamatan: proposal.lokasiKecamatan,
          latarBelakang: proposal.latarBelakang,
          tujuanProgram: proposal.tujuanProgram,
          indikatorKeberhasilan: proposal.indikatorKeberhasilan,
          targetPenerimaManfaat: proposal.targetPenerimaManfaat,
          jumlahPenerimaManfaat: proposal.jumlahPenerimaManfaat,
          anggaranFinal,
          tanggalMulaiFinal: new Date(tanggalMulaiFinal),
          tanggalSelesaiFinal: new Date(tanggalSelesaiFinal),
          penanggungJawabId,
          proposalAsalId: proposal.id,
        },
      });

      // 2. Update status proposal menjadi DIJALANKAN
      await tx.programProposal.update({
        where: { id: proposal.id },
        data: { status: 'DIJALANKAN' },
      });

      return newProgram;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json({ error: 'Gagal membuat program' }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions) as { user?: { id: string; role: string; name?: string; email?: string } } | null;
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const programs = await prisma.program.findMany({
      include: {
        penanggungJawab: {
          select: { name: true, email: true },
        },
        proposalAsal: {
          select: { judul: true, createdBy: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json({ error: 'Gagal mengambil data program' }, { status: 500 });
  }
}