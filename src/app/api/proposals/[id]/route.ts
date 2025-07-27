// app/api/proposals/[id]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// Fungsi untuk MENGAMBIL (Get) data proposal individual
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;

    const proposal = await prisma.programProposal.findUnique({
      where: { id: id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(proposal);
  } catch (_error) {
    return NextResponse.json({ error: 'Gagal mengambil data proposal' }, { status: 500 });
  }
}
// Fungsi untuk MENGUBAH (Update/PATCH) data proposal
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await request.json();

    const updatedProposal = await prisma.programProposal.update({
      where: { id: id },
      data: {
        // Kita akan update data yang dikirim di body
        // Contoh: { status: 'DIAJUKAN' } atau { judul: 'Judul Baru' }
        ...body,
      },
    });

    return NextResponse.json(updatedProposal);
  } catch (_error) {
    return NextResponse.json({ error: 'Gagal memperbarui proposal' }, { status: 500 });
  }
}


// Fungsi untuk MENGHAPUS (Delete) data proposal
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;

    await prisma.programProposal.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: 'Proposal berhasil dihapus' }, { status: 200 });
  } catch (_error) {
    return NextResponse.json({ error: 'Gagal menghapus proposal' }, { status: 500 });
  }
}