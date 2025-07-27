// app/api/my-programs/route.ts
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as { user?: { id: string; role?: string } } | null;
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const programs = await prisma.program.findMany({
      where: {
        penanggungJawabId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ programs });
  } catch (error) {
    console.error('Error fetching my programs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}