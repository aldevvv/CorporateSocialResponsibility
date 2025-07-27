// app/api/user-program/[userId]/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

// Use singleton pattern for Prisma client to avoid connection issues
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Validate userId
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Find the first program where user is responsible with optimized query
    const program = await prisma.program.findFirst({
      where: {
        penanggungJawabId: userId,
      },
      select: {
        id: true,
      },
    });

    const response = NextResponse.json({
      programId: program?.id || null
    });

    // Add cache headers for client-side caching
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    
    return response;
  } catch (error) {
    console.error('Error fetching user program:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    // Don't disconnect in serverless environments
    if (process.env.NODE_ENV !== 'production') {
      await prisma.$disconnect();
    }
  }
}