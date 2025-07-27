// app/dashboard/my-programs/page.tsx
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, Users, Eye, FileText, BarChart3, Briefcase, Target, Clock } from 'lucide-react';
import Link from 'next/link';

const prisma = new PrismaClient();

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

async function getMyPrograms(userId: string) {
  const programs = await prisma.program.findMany({
    where: {
      penanggungJawabId: userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return programs;
}

export default async function MyProgramsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !(session as { user: { id: string } }).user) {
    redirect('/login');
  }

  const programs = await getMyPrograms((session as { user: { id: string } }).user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="px-4 sm:px-6 py-6 sm:py-8">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Briefcase className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Program Saya</h1>
                <p className="text-blue-100 text-sm sm:text-base">
                  Kelola dan pantau program TJSL yang menjadi tanggung jawab Anda
                </p>
              </div>
            </div>
            
            {/* Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold">{programs.length}</div>
                <div className="text-xs text-blue-100">Total Program</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {programs.filter(p => p.status === 'BERJALAN').length}
                </div>
                <div className="text-xs text-blue-100">Sedang Berjalan</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {programs.filter(p => p.status === 'SELESAI').length}
                </div>
                <div className="text-xs text-blue-100">Selesai</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {programs.reduce((sum, p) => sum + p.jumlahPenerimaManfaat, 0).toLocaleString('id-ID')}
                </div>
                <div className="text-xs text-blue-100">Total Penerima</div>
              </div>
            </div>
          </div>
        </div>

        {programs.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
                <Briefcase className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Program</h3>
              <p className="text-gray-600 text-center max-w-md mb-4">
                Anda belum memiliki program yang ditugaskan. Program akan muncul di sini setelah Admin menugaskan Anda sebagai penanggung jawab.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="bg-white/50">
                  <FileText className="h-4 w-4 mr-2" />
                  Lihat Panduan
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {programs.map((program) => (
              <Card key={program.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                          <Target className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-gray-900">{program.judul}</CardTitle>
                          <CardDescription className="text-gray-600">
                            Pilar: {program.pilar.replace('_', ' ')}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={getStatusBadgeVariant(program.status)}
                        className={`${getStatusBadgeClassName(program.status)} font-medium`}
                      >
                        {program.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-6">
                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-700">Lokasi</span>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm">{program.lokasiKecamatan}</p>
                      <p className="text-xs text-gray-600">{program.lokasiKabupaten}</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-xs font-medium text-green-700">Anggaran</span>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                          notation: 'compact'
                        }).format(Number(program.anggaranFinal))}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <span className="text-xs font-medium text-purple-700">Periode</span>
                      </div>
                      <p className="font-semibold text-gray-900 text-xs">
                        {new Date(program.tanggalMulaiFinal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })} - {new Date(program.tanggalSelesaiFinal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-orange-600" />
                        <span className="text-xs font-medium text-orange-700">Penerima</span>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm">{program.jumlahPenerimaManfaat.toLocaleString('id-ID')}</p>
                      <p className="text-xs text-gray-600">orang</p>
                    </div>
                  </div>

                  {/* Program Details */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-600" />
                        Latar Belakang
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {program.latarBelakang}
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        Tujuan Program
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {program.tujuanProgram}
                      </p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-xl">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        Target Penerima Manfaat
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {program.targetPenerimaManfaat}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                    <Link href={`/dashboard/programs/${program.id}`} className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
                        <Eye className="h-4 w-4 mr-2" />
                        Lihat Detail
                      </Button>
                    </Link>
                    <Link href={`/dashboard/programs/${program.id}/reports`} className="flex-1">
                      <Button variant="outline" className="w-full bg-white/50 hover:bg-white/80">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Laporan
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}