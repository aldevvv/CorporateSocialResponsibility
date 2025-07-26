// app/api/account/avatar/route.ts
import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;
  if (!file) return NextResponse.json({ error: 'No file found' }, { status: 400 });

  // Validasi tipe file
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'File type not allowed. Only JPEG, PNG, and WebP are supported.' }, { status: 400 });
  }

  // Validasi ukuran file (maksimal 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File size too large. Maximum 5MB allowed.' }, { status: 400 });
  }

  try {
    // Simpan file ke /public/uploads/avatars
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${session.user.id}-${Date.now()}-${file.name}`;
    const path = join(process.cwd(), 'public/uploads/avatars', filename);
    await writeFile(path, buffer);

    // Dapatkan URL publik
    const publicUrl = `/uploads/avatars/${filename}`;

    // Update kolom 'image' di database User dengan URL baru
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: publicUrl },
    });

    // Hapus data sensitif dari respons
    const { password, ...result } = updatedUser;
    return NextResponse.json({ success: true, url: publicUrl, user: result });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ error: 'Failed to upload avatar' }, { status: 500 });
  }
}