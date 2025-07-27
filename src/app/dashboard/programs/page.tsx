// app/dashboard/programs/page.tsx
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  FileText,
  Clock,
  Building2,
  Target,
  TrendingUp
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

// Fungsi untuk mendapatkan variant Badge berdasarkan status program
function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'BERJALAN':
      return 'default'; // Biru
    case 'SELESAI':
      return 'default'; // Hijau (kita akan custom dengan className)
    case 'DITUNDA':
      return 'secondary'; // Abu-abu
    case 'DIBATALKAN':
      return 'destructive'; // Merah
    default:
      return 'secondary';
  }
}

// Fungsi untuk mendapatkan className tambahan untuk warna custom
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
    month: 'short',
    year: 'numeric',
  });
};

// Fungsi ini berjalan di server untuk mengambil data
async function getPrograms() {
  const programs = await prisma.program.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      penanggungJawab: {
        select: { name: true, email: true },
      },
      proposalAsal: {
        select: { 
          judul: true, 
          createdBy: { select: { name: true } } 
        },
      },
    },
  });
  return programs;
}

export default async function ProgramsPage() {
  const programs = await getPrograms();

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
              <BreadcrumbPage>Program Berjalan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-[#1E40AF] to-[#1E3A8A] rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Program Berjalan</h1>
              <p className="text-blue-100 mt-1">Kelola dan pantau program TJSL PLN UIP Makassar yang sedang aktif</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-blue-200" />
                <div>
                  <div className="text-2xl font-bold">{programs.length}</div>
                  <div className="text-blue-200 text-sm">Total Program</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-green-200" />
                <div>
                  <div className="text-2xl font-bold">{programs.filter(p => p.status === 'BERJALAN').length}</div>
                  <div className="text-blue-200 text-sm">Sedang Berjalan</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-yellow-200" />
                <div>
                  <div className="text-2xl font-bold">{programs.filter(p => p.status === 'SELESAI').length}</div>
                  <div className="text-blue-200 text-sm">Selesai</div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-purple-200" />
                <div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(programs.reduce((sum, p) => sum + Number(p.anggaranFinal), 0)).replace('Rp', '').trim()}
                  </div>
                  <div className="text-blue-200 text-sm">Total Anggaran</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      {programs.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-white rounded-2xl p-12 shadow-lg max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Program</h3>
            <p className="text-gray-600 mb-4">
              Program akan muncul di sini setelah proposal disetujui dan dikonversi.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <Link key={program.id} href={`/dashboard/programs/${program.id}`}>
              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden bg-white hover:scale-105 cursor-pointer">
                {/* Card Header with Gradient */}
                <div className="h-2 bg-gradient-to-r from-[#1E40AF] to-[#FCD34D]"></div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        {program.pilar.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${
                        program.status === 'SELESAI' ? 'bg-green-500' :
                        program.status === 'BERJALAN' ? 'bg-[#1E40AF]' :
                        program.status === 'DITUNDA' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}></div>
                      <Badge
                        variant={getStatusBadgeVariant(program.status)}
                        className={`text-xs font-bold uppercase tracking-wider ${getStatusBadgeClassName(program.status)}`}
                      >
                        {program.status === 'SELESAI' ? 'Completed' :
                         program.status === 'BERJALAN' ? 'Ongoing' :
                         program.status === 'DITUNDA' ? 'Paused' : program.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl text-gray-900 group-hover:text-[#1E40AF] transition-colors font-bold leading-tight line-clamp-2">
                    {program.judul}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Location and Responsible Person */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} className="text-[#1E40AF] flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{program.lokasiKecamatan}, {program.lokasiKabupaten}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users size={16} className="text-[#1E40AF] flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{program.penanggungJawab.name}</span>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-[#1E40AF]" />
                        <span className="text-xs font-semibold text-gray-600">Anggaran</span>
                      </div>
                      <div className="text-sm font-bold text-[#1E40AF]">
                        {formatCurrency(Number(program.anggaranFinal))}
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={16} className="text-[#1E40AF]" />
                      <span className="text-xs font-semibold text-gray-600">Jadwal</span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div><strong>Mulai:</strong> {formatDate(program.tanggalMulaiFinal)}</div>
                      <div><strong>Selesai:</strong> {formatDate(program.tanggalSelesaiFinal)}</div>
                    </div>
                  </div>

                  {/* Source Proposal */}
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={16} className="text-[#1E40AF]" />
                      <span className="text-xs font-semibold text-gray-600">Asal Proposal</span>
                    </div>
                    <div className="text-xs">
                      <div className="font-medium text-gray-900 truncate">{program.proposalAsal.judul}</div>
                      <div className="text-gray-600">oleh {program.proposalAsal.createdBy.name}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}