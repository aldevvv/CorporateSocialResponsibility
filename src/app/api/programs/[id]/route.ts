// app/api/programs/[id]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updatedProgram = await prisma.program.update({
      where: { id: params.id },
      data: {
        status: body.status,
      },
    });
    return NextResponse.json(updatedProgram);
  } catch (error) {
    console.error('Error updating program:', error);
    return NextResponse.json({ error: 'Gagal mengupdate program' }, { status: 500 });
  }
}