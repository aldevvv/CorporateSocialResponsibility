// app/dashboard/create-report/page.tsx
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export default async function CreateReportPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login');
  }

  // Check if user has a program assigned
  const program = await prisma.program.findFirst({
    where: {
      penanggungJawabId: session.user.id,
    },
  });

  // If user has a program, redirect to program-specific create report
  if (program) {
    redirect(`/dashboard/programs/${program.id}/create-report`);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Buat Laporan</h1>
        <p className="text-muted-foreground">Buat laporan progres program Anda</p>
      </div>

      <div className="text-center py-12">
        <p className="text-muted-foreground">Anda belum memiliki program yang ditugaskan.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Anda dapat membuat laporan setelah Admin menugaskan Anda sebagai penanggung jawab program.
        </p>
      </div>
    </div>
  );
}