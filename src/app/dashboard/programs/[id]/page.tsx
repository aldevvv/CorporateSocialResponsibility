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
import {
  FileText,
  ClipboardList,
  Upload,
  Eye,
  Users,
  MapPin,
  DollarSign,
  Calendar,
  Building2
} from 'lucide-react';
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
      penanggungJawab: true,
      proposalAsal: {
        select: { judul: true, createdBy: { select: { name: true } } },
      },
      laporanProgres: {
        include: { createdBy: true },
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Breadcrumb Navigation */}
      <div className="mb-8">
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
      </div>

      {/* Program Header */}
      <div className="bg-gradient-to-r from-[#1E40AF] to-[#1E3A8A] rounded-2xl p-8 text-white shadow-xl mb-8">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <Badge
                variant={getStatusBadgeVariant(program.status)}
                className={`${getStatusBadgeClassName(program.status)} border-white/20`}
              >
                {program.status}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-3 text-white">{program.judul}</h1>
            <div className="space-y-2 text-blue-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Penanggung Jawab: {program.penanggungJawab.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{program.lokasiKecamatan}, {program.lokasiKabupaten}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Pilar: {program.pilar.replace(/_/g, ' ')}</span>
              </div>
            </div>
          </div>
          {isAdmin && (
            <div className="flex gap-3">
              <ProgramActions program={program} />
              <GenerateLpjButton program={program} />
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-700">Anggaran Program</CardTitle>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{formatCurrency(Number(program.anggaranFinal.toString()))}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-700">Total Laporan</CardTitle>
              <ClipboardList className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{program.laporanProgres.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-purple-700">Total Dokumen</CardTitle>
              <Upload className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{program.dokumenPenting.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-orange-700">Penerima Manfaat</CardTitle>
              <Users className="w-5 h-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{program.jumlahPenerimaManfaat}</div>
            <div className="text-xs text-orange-600 mt-1">Orang/KK</div>
          </CardContent>
        </Card>
      </div>

      {/* Program Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Basic Information */}
        <Card className="shadow-lg border-0 bg-white hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6" />
              <CardTitle className="text-xl">Informasi Dasar</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <DetailItem label="Pilar TJSL" value={program.pilar.replace(/_/g, ' ')} />
            <DetailItem label="Lokasi Kabupaten/Kota" value={program.lokasiKabupaten} />
            <DetailItem label="Lokasi Kecamatan" value={program.lokasiKecamatan} />
            <DetailItem label="Penanggung Jawab" value={`${program.penanggungJawab.name} (${program.penanggungJawab.email})`} />
          </CardContent>
        </Card>

        {/* Schedule & Budget */}
        <Card className="shadow-lg border-0 bg-white hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6" />
              <CardTitle className="text-xl">Anggaran & Jadwal</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <DetailItem label="Anggaran Final" value={formatCurrency(Number(program.anggaranFinal.toString()))} />
            <DetailItem label="Tanggal Mulai" value={formatDate(program.tanggalMulaiFinal)} />
            <DetailItem label="Tanggal Selesai" value={formatDate(program.tanggalSelesaiFinal)} />
            <DetailItem label="Jumlah Penerima Manfaat" value={`${program.jumlahPenerimaManfaat} Orang/KK`} />
          </CardContent>
        </Card>
      </div>

      {/* Program Details */}
      <Card className="shadow-lg border-0 bg-white hover:shadow-xl transition-shadow mb-8">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6" />
            <CardTitle className="text-xl">Detail Program</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <DetailItem label="Latar Belakang" value={program.latarBelakang} />
          <DetailItem label="Tujuan Program" value={program.tujuanProgram} />
          <DetailItem label="Target Penerima Manfaat" value={program.targetPenerimaManfaat} />
          <DetailItem label="Indikator Keberhasilan (KPI)" value={program.indikatorKeberhasilan} />
        </CardContent>
      </Card>

      {/* Navigation Cards - Only for Admin */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href={`/dashboard/programs/${id}/reports`}>
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden bg-white hover:scale-105 cursor-pointer h-full flex flex-col">
              <div className="h-2 bg-gradient-to-r from-green-500 to-green-600"></div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                        Riwayat Laporan
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {program.laporanProgres.length} laporan tersedia
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex items-end">
                <p className="text-gray-600 leading-relaxed">
                  Lihat semua laporan progres yang telah dibuat untuk program ini
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/dashboard/programs/${id}/documents`}>
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden bg-white hover:scale-105 cursor-pointer h-full flex flex-col">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                        Manajemen Dokumen
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {program.dokumenPenting.length} dokumen tersimpan
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex items-end">
                <p className="text-gray-600 leading-relaxed">
                  Upload dan kelola dokumen penting program
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}

      {/* Recent Activity */}
      <div className="space-y-8">
        <Card className="shadow-lg border-0 bg-white hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-6 h-6" />
              <CardTitle className="text-xl">Laporan Terbaru</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {program.laporanProgres.length > 0 ? (
              <div className="space-y-4">
                {program.laporanProgres.slice(0, 5).map((laporan) => (
                  <div key={laporan.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{laporan.tipeLaporan.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(new Date(laporan.createdAt))} • oleh {laporan.createdBy.name}
                      </p>
                    </div>
                  </div>
                ))}
                <Link href={`/dashboard/programs/${id}/reports`}>
                  <Button variant="outline" size="sm" className="w-full mt-4 border-blue-200 text-blue-600 hover:bg-blue-50">
                    Lihat Semua Laporan
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ClipboardList className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-600">Belum ada laporan</p>
                <p className="text-sm text-gray-500 mt-1">Laporan akan muncul di sini setelah dibuat</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <Upload className="w-6 h-6" />
              <CardTitle className="text-xl">Dokumen Terbaru</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {program.dokumenPenting.length > 0 ? (
              <div className="space-y-4">
                {program.dokumenPenting.slice(0, 5).map((dokumen) => (
                  <div key={dokumen.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 truncate">{dokumen.namaDokumen}</p>
                      <p className="text-sm text-gray-600">{dokumen.tipeDokumen}</p>
                    </div>
                  </div>
                ))}
                <Link href={`/dashboard/programs/${id}/documents`}>
                  <Button variant="outline" size="sm" className="w-full mt-4 border-purple-200 text-purple-600 hover:bg-purple-50">
                    Lihat Semua Dokumen
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-600">Belum ada dokumen</p>
                <p className="text-sm text-gray-500 mt-1">Dokumen akan muncul di sini setelah diupload</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}