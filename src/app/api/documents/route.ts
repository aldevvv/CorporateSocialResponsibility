// app/api/documents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  
  const file = formData.get('file') as File;
  const programId = formData.get('programId') as string;
  const userId = formData.get('userId') as string;
  const tipeDokumen = formData.get('tipeDokumen') as string;

  if (!file || !programId || !userId) {
    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  }

  try {
    const filename = `${programId}/${Date.now()}-${file.name}`;

    // 1. Upload file ke Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('dokumen-tjsl') // Nama bucket untuk dokumen
      .upload(filename, file);

    if (uploadError) {
      throw new Error(`Supabase Upload Error: ${uploadError.message}`);
    }

    // 2. Dapatkan URL publik dari file yang baru di-upload
    const { data } = supabase.storage
      .from('dokumen-tjsl')
      .getPublicUrl(filename);

    // 3. Simpan metadata (TERMASUK URL) ke database PostgreSQL via Prisma
    const doc = await prisma.dokumenProgram.create({
      data: {
        namaDokumen: file.name,
        tipeDokumen: tipeDokumen || 'LAINNYA', // Sesuaikan jika perlu
        urlDokumen: data.publicUrl, // Simpan URL, bukan konten file
        kunciFile: filename, // Simpan path/key untuk manajemen file nanti
        programId: programId,
        uploadedById: userId,
      }
    });

    return NextResponse.json(doc, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal memproses file' }, { status: 500 });
  }
}