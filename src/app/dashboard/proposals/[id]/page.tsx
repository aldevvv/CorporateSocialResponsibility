// app/dashboard/proposals/[id]/page.tsx
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { ProposalActions } from '../components/ProposalActions';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const prisma = new PrismaClient();

// Fungsi untuk mengambil data proposal tunggal
async function getProposal(id: string) {
  const proposal = await prisma.programProposal.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: { name: true, email: true },
      },
    },
  });
  return proposal;
}

// Helper untuk format mata uang
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Helper untuk format tanggal
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Komponen kecil untuk menampilkan item detail
function DetailItem({ label, value }: { label: string; value: string | number | undefined | null }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-lg text-gray-800">{value || '-'}</p>
    </div>
  );
}

export default async function ProposalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const proposal = await getProposal(resolvedParams.id);

  if (!proposal) {
    notFound();
  }
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'secondary';
      case 'DIAJUKAN':
        return 'default';
      case 'DISETUJUI':
        return 'default';
      case 'DITOLAK':
        return 'destructive';
      case 'SELESAI':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/proposals">Proposal Program</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{proposal.judul}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="p-6 bg-white rounded-lg shadow flex justify-between items-start">
        <div>
          <Badge variant={getStatusVariant(proposal.status)} className="mb-2">{proposal.status}</Badge>
          <h1 className="text-3xl font-bold">{proposal.judul}</h1>
          <p className="text-muted-foreground">Dibuat oleh: {proposal.createdBy.name} pada {formatDate(proposal.createdAt)}</p>
        </div>
        <div>
          <ProposalActions proposal={proposal} />
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold border-b pb-3 mb-4">Informasi Dasar</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DetailItem label="Pilar TJSL" value={proposal.pilar.replace(/_/g, ' ')} />
          <DetailItem label="Lokasi Kabupaten/Kota" value={proposal.lokasiKabupaten} />
          <DetailItem label="Lokasi Kecamatan" value={proposal.lokasiKecamatan} />
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold border-b pb-3 mb-4">Detail & Justifikasi Program</h2>
        <div className="space-y-6">
          <DetailItem label="Latar Belakang" value={proposal.latarBelakang} />
          <DetailItem label="Tujuan Program" value={proposal.tujuanProgram} />
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold border-b pb-3 mb-4">Target & Pengukuran</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DetailItem label="Target Penerima Manfaat" value={proposal.targetPenerimaManfaat} />
          <DetailItem label="Jumlah Penerima Manfaat" value={`${proposal.jumlahPenerimaManfaat} Orang/KK`} />
          <DetailItem label="Indikator Keberhasilan (KPI)" value={proposal.indikatorKeberhasilan} />
        </div>
      </div>
      
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold border-b pb-3 mb-4">Anggaran & Jadwal</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DetailItem label="Estimasi Anggaran" value={formatCurrency(Number(proposal.estimasiAnggaran))} />
          <DetailItem label="Perkiraan Tanggal Mulai" value={formatDate(proposal.perkiraanMulai)} />
          <DetailItem label="Perkiraan Tanggal Selesai" value={formatDate(proposal.perkiraanSelesai)} />
        </div>
      </div>
    </div>
  );
}