// app/dashboard/programs/[id]/create-report/page.tsx
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { BuatLaporan } from '../components/BuatLaporan';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const prisma = new PrismaClient();

async function getProgram(id: string) {
  const program = await prisma.program.findUnique({
    where: { id },
    select: {
      id: true,
      judul: true,
      penanggungJawabId: true,
    },
  });
  return program;
}

export default async function CreateReportPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login');
  }

  const program = await getProgram(params.id);

  if (!program) {
    notFound();
  }

  // Check access rights - hanya penanggung jawab yang bisa buat laporan
  const isResponsible = program.penanggungJawabId === session.user.id;

  if (!isResponsible) {
    return (
      <div className="space-y-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold text-red-600">Akses Ditolak</h1>
          <p className="text-gray-600 mt-2">Hanya penanggung jawab program yang dapat membuat laporan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/my-programs">Program Saya</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/dashboard/programs/${params.id}`}>
                {program.judul}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Buat Laporan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Create Report Section */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-2">Buat Laporan Baru</h1>
        <p className="text-gray-600 mb-6">Program: {program.judul}</p>
        
        {/* Form untuk membuat laporan baru */}
        <BuatLaporan programId={program.id} />
      </div>
    </div>
  );
}