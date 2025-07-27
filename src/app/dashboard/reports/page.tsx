// app/dashboard/reports/page.tsx
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !(session as { user: { id: string } }).user) {
    redirect('/login');
  }

  // Check if user has a program assigned
  const program = await prisma.program.findFirst({
    where: {
      penanggungJawabId: (session as { user: { id: string } }).user.id,
    },
  });

  // If user has a program, redirect to program-specific reports
  if (program) {
    redirect(`/dashboard/programs/${program.id}/reports`);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Riwayat Laporan</h1>
        <p className="text-muted-foreground">Daftar laporan progres program Anda</p>
      </div>

      <div className="text-center py-12">
        <p className="text-muted-foreground">Anda belum memiliki program yang ditugaskan.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Laporan akan muncul di sini setelah Admin menugaskan Anda sebagai penanggung jawab program.
        </p>
      </div>
    </div>
  );
}