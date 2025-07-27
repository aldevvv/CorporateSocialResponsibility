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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-8 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Akses Ditolak</h1>
                  <p className="text-red-100 mt-1">Tidak memiliki izin untuk mengakses halaman ini</p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-600 text-lg leading-relaxed">
                Hanya penanggung jawab program yang dapat membuat laporan. Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
              </p>
              <div className="mt-6">
                <Link
                  href="/dashboard/my-programs"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Kembali ke Program Saya
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList className="text-sm">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard/my-programs" className="text-blue-600 hover:text-blue-800 transition-colors">
                    Program Saya
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/dashboard/programs/${params.id}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                    {program.judul}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-600">Buat Laporan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 sm:px-8 py-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Buat Laporan Baru</h1>
                  <p className="text-blue-100 mt-2 text-lg">
                    Program: <span className="font-semibold">{program.judul}</span>
                  </p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="bg-white/20 rounded-lg px-4 py-2">
                  <p className="text-sm text-blue-100">Status</p>
                  <p className="font-semibold">Penanggung Jawab</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Report Form Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <BuatLaporan programId={program.id} />
          </div>
        </div>
      </div>
    </div>
  );
}