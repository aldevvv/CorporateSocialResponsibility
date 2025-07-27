// app/api/documents/[id]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doc = await prisma.dokumenProgram.findUnique({
      where: { id },
    });

    if (!doc) {
      return NextResponse.json({ error: 'Dokumen tidak ditemukan' }, { status: 404 });
    }

    // Return file content as response
    const buffer = Buffer.from(doc.fileContent, 'base64');
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': doc.mimeType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${doc.namaDokumen}"`,
      },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil dokumen' }, { status: 500 });
  }
}