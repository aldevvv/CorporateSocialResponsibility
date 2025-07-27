// app/dashboard/programs/[id]/reports/page.tsx
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
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
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

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

export default async function ProgramReportsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions) as { user: { id: string; role: string } } | null;
  if (!session?.user) {
    redirect('/login');
  }

  const { id } = await params;
  const program = await getProgramReports(id);

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

  // Convert Date objects to strings for the component
  const formattedReports = program.laporanProgres.map(report => ({
    ...report,
    createdAt: report.createdAt.toISOString(),
    createdBy: {
      name: report.createdBy.name || '',
      email: report.createdBy.email,
    }
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        {/* Breadcrumb Navigation - Moved to top */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-6">
          <CardContent className="p-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={isAdmin ? "/dashboard" : "/dashboard/my-programs"} className="text-blue-600 hover:text-blue-800">
                      {isAdmin ? "Dashboard" : "Program Saya"}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/dashboard/programs/${id}`} className="text-blue-600 hover:text-blue-800">
                      {program.judul}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-gray-700 font-medium">Riwayat Laporan</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </CardContent>
        </Card>

        {/* Modern Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Riwayat Laporan</h1>
                <p className="text-indigo-100 text-sm sm:text-base">
                  Program: {program.judul}
                </p>
              </div>
            </div>
            
            {/* Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold">{program.laporanProgres.length}</div>
                <div className="text-xs text-indigo-100">Total Laporan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {program.laporanProgres.filter(r => r.tipeLaporan === 'PROGRES_RUTIN').length}
                </div>
                <div className="text-xs text-indigo-100">Progres Rutin</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {program.laporanProgres.filter(r => r.tipeLaporan === 'KEUANGAN').length}
                </div>
                <div className="text-xs text-indigo-100">Keuangan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {program.laporanProgres.filter(r => r.tipeLaporan === 'PENCAPAIAN_MILESTONE').length}
                </div>
                <div className="text-xs text-indigo-100">Milestone</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <LaporanList
              programId={id}
              initialReports={formattedReports as Array<{
                id: string;
                tipeLaporan: string;
                data: Record<string, string | number | Date>;
                programId: string;
                createdById: string;
                createdAt: string;
                updatedAt: Date;
                createdBy: {
                  name: string;
                  email: string;
                };
              }>}
              initialPagination={{
                currentPage: 1,
                totalPages: Math.ceil(program.laporanProgres.length / 10),
                totalCount: program.laporanProgres.length,
                limit: 10,
                hasNext: program.laporanProgres.length > 10,
                hasPrev: false,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}