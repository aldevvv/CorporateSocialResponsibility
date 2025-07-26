// app/api/user-program/[userId]/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    // Find the first program where user is responsible
    const program = await prisma.program.findFirst({
      where: {
        penanggungJawabId: userId,
      },
      select: {
        id: true,
      },
    });

    if (!program) {
      return NextResponse.json({ programId: null });
    }

    return NextResponse.json({ programId: program.id });
  } catch (error) {
    console.error('Error fetching user program:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}