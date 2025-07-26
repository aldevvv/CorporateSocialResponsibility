// app/dashboard/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // Arahkan pengguna berdasarkan peran mereka
  if (session?.user?.role === 'ADMIN') {
    redirect('/dashboard/proposals'); // Admin diarahkan ke daftar proposal
  } else if (session?.user?.role === 'USER') {
    redirect('/dashboard/my-programs'); // User diarahkan ke daftar program mereka
  } else {
    redirect('/login'); // Jika tidak ada sesi atau peran, kembali ke login
  }

  return null; // Halaman ini hanya bertugas mengarahkan
}