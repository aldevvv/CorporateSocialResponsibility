// app/api/proposals/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // 1. Ambil sesi untuk otorisasi
    const session = await getServerSession(authOptions);

    // 2. Cek apakah user adalah ADMIN
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 3. Ambil data dari body request
    const body = await request.json();

    // 4. Simpan data ke database menggunakan Prisma
    const newProposal = await prisma.programProposal.create({
      data: {
        ...body, // Kita langsung gunakan semua data dari body
        createdById: session.user.id,
      },
    });

    // 5. Kembalikan data proposal yang baru dibuat
    return NextResponse.json(newProposal, { status: 201 });
  } catch (error) {
    console.error('Error creating proposal:', error);
    return NextResponse.json({ error: 'Gagal membuat proposal' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const proposals = await prisma.programProposal.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(proposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}