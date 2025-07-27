// app/dashboard/programs/[id]/documents/page.tsx
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ManajemenDokumen } from '../components/ManajemenDokumen';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const prisma = new PrismaClient();

async function getProgramDocuments(id: string) {
  const program = await prisma.program.findUnique({
    where: { id },
    select: {
      id: true,
      judul: true,
      penanggungJawabId: true,
      dokumenPenting: {
        orderBy: { createdAt: 'desc' },
        include: {
          uploadedBy: {
            select: { name: true },
          },
        },
      },
    },
  });
  return program;
}

export default async function ProgramDocumentsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login');
  }

  const { id } = await params;
  const program = await getProgramDocuments(id);

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
              <Link href={`/dashboard/programs/${id}`}>
                {program.judul}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Manajemen Dokumen</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Document Management Section */}
      <div className="space-y-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h1 className="text-3xl font-bold mb-2">Manajemen Dokumen</h1>
          <p className="text-gray-600 mb-6">Program: {program.judul}</p>
        </div>
        
        <ManajemenDokumen 
          programId={program.id} 
          userId={session.user.id} 
          dokumen={program.dokumenPenting} 
        />
      </div>
    </div>
  );
}