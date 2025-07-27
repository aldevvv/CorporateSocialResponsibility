// app/api/programs/[id]/reports/route.ts
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';

    const { id } = await params;

    // Check if program exists and user has access
    const program = await prisma.program.findUnique({
      where: { id },
      select: {
        id: true,
        judul: true,
        penanggungJawabId: true,
      },
    });

    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }

    // Check access rights
    const isResponsible = program.penanggungJawabId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isAdmin && !isResponsible) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Build where clause for filtering
    const whereClause: any = {
      programId: id,
    };

    if (type && type !== 'all') {
      whereClause.tipeLaporan = type;
    }

    if (search) {
      whereClause.OR = [
        {
          createdBy: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    // Get total count for pagination
    const totalCount = await prisma.laporanProgres.count({
      where: whereClause,
    });

    // Get paginated reports
    const reports = await prisma.laporanProgres.findMany({
      where: whereClause,
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      reports,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      program: {
        id: program.id,
        judul: program.judul,
      },
    });
  } catch (error) {
    console.error('Error fetching program reports:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}