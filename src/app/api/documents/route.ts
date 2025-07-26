// app/api/documents/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const file = formData.get('file') as File;
  const programId = formData.get('programId') as string;
  const userId = formData.get('userId') as string;
  const tipeDokumen = formData.get('tipeDokumen') as any;

  if (!file || !programId || !userId) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  try {
    // 1. Baca file menjadi buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Konversi buffer ke string Base64
    const base64Content = buffer.toString('base64');

    // 3. Simpan semua data ke database
    const doc = await prisma.dokumenProgram.create({
      data: {
        namaDokumen: file.name,
        tipeDokumen: tipeDokumen || 'LAINNYA',
        mimeType: file.type,
        fileContent: base64Content,
        programId: programId,
        uploadedById: userId,
      }
    });

    // Jangan kembalikan konten file di respons JSON
    const { fileContent, ...result } = doc; 
    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal memproses file' }, { status: 500 });
  }
}