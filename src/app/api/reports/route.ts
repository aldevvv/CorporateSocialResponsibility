// app/api/reports/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { programId, tipeLaporan, data } = body;

    // Verify that the user is the responsible person for this program (for USER role)
    if (session.user.role === 'USER') {
      const program = await prisma.program.findUnique({
        where: { id: programId },
        select: { penanggungJawabId: true },
      });

      if (!program || program.penanggungJawabId !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized: You are not responsible for this program' }, { status: 403 });
      }
    }

    const newReport = await prisma.laporanProgres.create({
      data: {
        programId,
        tipeLaporan,
        data, // data JSON dari form
        createdById: session.user.id,
      },
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ error: 'Gagal menyimpan laporan' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const programId = searchParams.get('programId');

    if (!programId) {
      return NextResponse.json({ error: 'Program ID is required' }, { status: 400 });
    }

    // Verify access to this program
    if (session.user.role === 'USER') {
      const program = await prisma.program.findUnique({
        where: { id: programId },
        select: { penanggungJawabId: true },
      });

      if (!program || program.penanggungJawabId !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized: You are not responsible for this program' }, { status: 403 });
      }
    }

    const reports = await prisma.laporanProgres.findMany({
      where: { programId },
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Gagal mengambil data laporan' }, { status: 500 });
  }
}