// app/dashboard/programs/[id]/reports/page.tsx
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { LaporanList } from '../components/LaporanList';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const prisma = new PrismaClient();

async function getProgramReports(id: string) {
  const program = await prisma.program.findUnique({
    where: { id },
    select: {
      id: true,
      judul: true,
      penanggungJawabId: true,
      laporanProgres: {
        orderBy: { createdAt: 'desc' },
        include: { 
          createdBy: {
            select: { name: true, email: true },
          },
        },
      },
    },
  });
  return program;
}

export default async function ProgramReportsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login');
  }

  const program = await getProgramReports(params.id);

  if (!program) {
    notFound();
  }

  // Check access rights
  const isResponsible = program.penanggungJawabId === session.user.id;
  const isAdmin = session.user.role === 'ADMIN';

  if (!isAdmin && !isResponsible) {
    return (
      <div className="space-y-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold text-red-600">Akses Ditolak</h1>
          <p className="text-gray-600 mt-2">Anda tidak memiliki akses untuk melihat program ini.</p>
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
              <Link href={isAdmin ? "/dashboard" : "/dashboard/my-programs"}>
                {isAdmin ? "Dashboard" : "Program Saya"}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={isAdmin ? "/dashboard/programs" : "/dashboard/my-programs"}>
                {isAdmin ? "Program Berjalan" : "Program Saya"}
              </Link>
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
            <BreadcrumbPage>Riwayat Laporan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Reports Section */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-2">Riwayat Laporan</h1>
        <p className="text-gray-600 mb-6">Program: {program.judul}</p>
        
        {/* Daftar laporan yang sudah masuk */}
        <LaporanList 
          programId={params.id}
          initialReports={program.laporanProgres}
          initialPagination={{
            currentPage: 1,
            totalPages: Math.ceil(program.laporanProgres.length / 10),
            totalCount: program.laporanProgres.length,
            limit: 10,
            hasNext: program.laporanProgres.length > 10,
            hasPrev: false,
          }}
        />
      </div>
    </div>
  );
}