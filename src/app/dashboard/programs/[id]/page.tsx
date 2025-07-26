// app/dashboard/programs/[id]/page.tsx
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgramActions } from './components/ProgramActions';
import { GenerateLpjButton } from './components/GenerateLpjButton';
import { FileText, ClipboardList, Upload, Eye } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const prisma = new PrismaClient();

async function getProgramDetails(id: string) {
  const program = await prisma.program.findUnique({
    where: { id },
    include: {
      penanggungJawab: {
        select: { name: true, email: true },
      },
      proposalAsal: {
        select: { judul: true, createdBy: { select: { name: true } } },
      },
      laporanProgres: {
        select: { id: true, tipeLaporan: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      dokumenPenting: {
        select: { id: true, namaDokumen: true, tipeDokumen: true },
        take: 5,
      },
    },
  });
  return program;
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

// Fungsi untuk mendapatkan variant Badge berdasarkan status program
function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'BERJALAN':
      return 'default';
    case 'SELESAI':
      return 'default';
    case 'DITUNDA':
      return 'secondary';
    case 'DIBATALKAN':
      return 'destructive';
    default:
      return 'secondary';
  }
}

function getStatusBadgeClassName(status: string) {
  switch (status) {
    case 'BERJALAN':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'SELESAI':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'DITUNDA':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    default:
      return '';
  }
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login');
  }

  const { id } = await params;
  const program = await getProgramDetails(id);

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
              <Link href="/dashboard">Dashboard</Link>
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
            <BreadcrumbPage>{program.judul}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Program Header */}
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Badge 
              variant={getStatusBadgeVariant(program.status)} 
              className={`mb-2 ${getStatusBadgeClassName(program.status)}`}
            >
              {program.status}
            </Badge>
            <h1 className="text-3xl font-bold">{program.judul}</h1>
            <p className="text-muted-foreground">
              Penanggung Jawab: {program.penanggungJawab.name} ({program.penanggungJawab.email})
            </p>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <ProgramActions program={program} />
              <GenerateLpjButton program={program} />
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Anggaran Program</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(Number(program.anggaranFinal.toString()))}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Laporan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{program.laporanProgres.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Dokumen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{program.dokumenPenting.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Program Information */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold border-b pb-3 mb-4">Informasi Program</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DetailItem label="Pilar TJSL" value={program.pilar.replace(/_/g, ' ')} />
          <DetailItem label="Lokasi Kabupaten/Kota" value={program.lokasiKabupaten} />
          <DetailItem label="Lokasi Kecamatan" value={program.lokasiKecamatan} />
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold border-b pb-3 mb-4">Detail Program</h2>
        <div className="space-y-6">
          <DetailItem label="Latar Belakang" value={program.latarBelakang} />
          <DetailItem label="Tujuan Program" value={program.tujuanProgram} />
          <DetailItem label="Target Penerima Manfaat" value={program.targetPenerimaManfaat} />
          <DetailItem label="Jumlah Penerima Manfaat" value={`${program.jumlahPenerimaManfaat} Orang/KK`} />
          <DetailItem label="Indikator Keberhasilan (KPI)" value={program.indikatorKeberhasilan} />
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold border-b pb-3 mb-4">Anggaran & Jadwal</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DetailItem label="Anggaran Final" value={formatCurrency(Number(program.anggaranFinal.toString()))} />
          <DetailItem label="Tanggal Mulai" value={formatDate(program.tanggalMulaiFinal)} />
          <DetailItem label="Tanggal Selesai" value={formatDate(program.tanggalSelesaiFinal)} />
        </div>
      </div>

      {/* Navigation Cards - Only for Admin */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href={`/dashboard/programs/${id}/reports`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Riwayat Laporan</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Lihat semua laporan progres yang telah dibuat
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href={`/dashboard/programs/${id}/documents`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Manajemen Dokumen</CardTitle>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Upload dan kelola dokumen penting program
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Laporan Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {program.laporanProgres.length > 0 ? (
              <div className="space-y-3">
                {program.laporanProgres.slice(0, 5).map((laporan) => (
                  <div key={laporan.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{laporan.tipeLaporan.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(new Date(laporan.createdAt))}
                      </p>
                    </div>
                  </div>
                ))}
                <Link href={`/dashboard/programs/${id}/reports`}>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Lihat Semua Laporan
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada laporan</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dokumen Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {program.dokumenPenting.length > 0 ? (
              <div className="space-y-3">
                {program.dokumenPenting.slice(0, 5).map((dokumen) => (
                  <div key={dokumen.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{dokumen.namaDokumen}</p>
                      <p className="text-xs text-muted-foreground">{dokumen.tipeDokumen}</p>
                    </div>
                  </div>
                ))}
                <Link href={`/dashboard/programs/${id}/documents`}>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Lihat Semua Dokumen
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada dokumen</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}