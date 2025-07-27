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

    // Redirect ke URL Supabase Storage
    return NextResponse.redirect(doc.urlDokumen);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil dokumen' }, { status: 500 });
  }
}