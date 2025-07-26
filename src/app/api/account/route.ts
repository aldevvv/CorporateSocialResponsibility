// app/api/account/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { compare, hash } from 'bcryptjs';

const prisma = new PrismaClient();

export async function PATCH(request: Request) {
  // 1. Dapatkan sesi pengguna untuk otorisasi
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Ambil data dari body request (hapus 'image' dari sini)
  const { name, email, currentPassword, newPassword } = await request.json();

  // 3. Ambil data pengguna saat ini dari database untuk verifikasi
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
  }

  // 4. Verifikasi password saat ini jika pengguna ingin mengubah email atau password baru
  if (email || newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: 'Password saat ini diperlukan' }, { status: 400 });
    }
    const isPasswordValid = await compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Password saat ini salah' }, { status: 403 });
    }
  }

  // 5. Siapkan data yang akan diperbarui (tanpa image)
  const dataToUpdate: { name?: string; email?: string; password?: string } = {};
  
  if (name) dataToUpdate.name = name;
  if (email) dataToUpdate.email = email;
  if (newPassword) {
    // Hash password baru sebelum disimpan
    dataToUpdate.password = await hash(newPassword, 12);
  }

  // 6. Lakukan update ke database
  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: dataToUpdate,
    });
    // Hapus data sensitif dari respons
    const { password, ...result } = updatedUser;
    return NextResponse.json(result);
  } catch (error) {
    // Tangani error jika email baru sudah terdaftar
    if ((error as any).code === 'P2002' && (error as any).meta?.target?.includes('email')) {
        return NextResponse.json({ error: 'Email ini sudah digunakan oleh akun lain.' }, { status: 409 });
    }
    // Tangani error umum lainnya
    return NextResponse.json({ error: 'Gagal memperbarui akun' }, { status: 500 });
  }
}