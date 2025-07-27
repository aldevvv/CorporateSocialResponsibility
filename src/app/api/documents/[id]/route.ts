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

    // Redirect to the document URL (since files are stored externally)
    if (doc.urlDokumen) {
      return NextResponse.redirect(doc.urlDokumen);
    }
    
    // If no URL available, return document metadata
    return NextResponse.json({
      id: doc.id,
      namaDokumen: doc.namaDokumen,
      tipeDokumen: doc.tipeDokumen,
      urlDokumen: doc.urlDokumen,
      kunciFile: doc.kunciFile,
      createdAt: doc.createdAt,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil dokumen' }, { status: 500 });
  }
}