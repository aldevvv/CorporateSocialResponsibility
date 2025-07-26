// app/api/documents/[id]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const doc = await prisma.dokumenProgram.findUnique({
      where: { id: params.id },
    });

    if (!doc) {
      return NextResponse.json({ error: 'Dokumen tidak ditemukan' }, { status: 404 });
    }

    // 1. Konversi Base64 kembali ke buffer
    const buffer = Buffer.from(doc.fileContent, 'base64');

    // 2. Siapkan headers untuk download
    const headers = new Headers();
    headers.set('Content-Type', doc.mimeType);
    headers.set('Content-Disposition', `attachment; filename="${doc.namaDokumen}"`);

    return new NextResponse(buffer, { headers });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil dokumen' }, { status: 500 });
  }
}