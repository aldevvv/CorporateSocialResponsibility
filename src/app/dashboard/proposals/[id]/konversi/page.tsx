// app/dashboard/proposals/[id]/konversi/page.tsx
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { KonversiForm } from './components/KonversiForm';
import { ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const prisma = new PrismaClient();

// Ambil data proposal dan daftar user yang bisa jadi penanggung jawab
async function getData(id: string) {
  const proposal = await prisma.programProposal.findUnique({ where: { id } });
  const users = await prisma.user.findMany({ where: { role: 'USER' } }); // Ambil semua user dengan role 'USER'
  return { proposal, users };
}

export default async function KonversiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { proposal, users } = await getData(id);

  if (!proposal || proposal.status !== 'DISETUJUI') {
    return (
      <div className="space-y-6 p-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard/overview">Overview</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard/proposals">Manajemen Proposal</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/dashboard/proposals/${id}`}>{proposal?.judul || 'Proposal'}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Konversi</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Error State */}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start space-x-3 p-4 border border-red-200 bg-red-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="text-red-800">
              <div className="font-semibold">Akses Ditolak</div>
              <div className="text-sm mt-1">
                Hanya proposal yang berstatus DISETUJUI yang bisa dikonversi menjadi program resmi.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Serialize proposal data untuk client component
  const serializedProposal = {
    ...proposal,
    estimasiAnggaran: Number(proposal.estimasiAnggaran),
    perkiraanMulai: proposal.perkiraanMulai.toISOString(),
    perkiraanSelesai: proposal.perkiraanSelesai.toISOString(),
    createdAt: proposal.createdAt.toISOString(),
    updatedAt: proposal.updatedAt.toISOString(),
  };

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/overview">Overview</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/proposals">Manajemen Proposal</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/dashboard/proposals/${proposal.id}`}>{proposal.judul}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Konversi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Konversi Menjadi Program Resmi
          </h1>
          <p className="text-gray-600 mt-1">Finalisasi detail untuk program &ldquo;{proposal.judul}&rdquo; sebelum dieksekusi</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
          <CheckCircle className="h-4 w-4" />
          <span>Proposal Disetujui</span>
          <ArrowRight className="h-4 w-4" />
          <span>Siap Konversi</span>
        </div>
      </div>

      {/* Success Alert */}
      <div className="flex items-start space-x-3 p-4 border border-green-200 bg-green-50 rounded-lg">
        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
        <div className="text-green-800">
          <div className="font-medium">Proposal Siap Dikonversi</div>
          <div className="text-sm mt-1">
            Proposal telah disetujui dan siap untuk dikonversi menjadi program resmi. 
            Silakan lengkapi informasi final di bawah ini.
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-lg border shadow-sm">
        <KonversiForm
          proposal={serializedProposal as unknown as {
            id: string;
            judul: string;
            pilar: string;
            lokasiKecamatan: string;
            lokasiKabupaten: string;
            estimasiAnggaran: number;
            jumlahPenerimaManfaat: number;
            perkiraanMulai: Date;
            perkiraanSelesai: Date;
          }}
          users={users as unknown as Array<{
            id: string;
            name: string;
            email: string;
          }>}
        />
      </div>
    </div>
  );
}