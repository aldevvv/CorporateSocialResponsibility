// app/dashboard/my-programs/page.tsx
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, DollarSign, Users } from 'lucide-react';

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
  if (!session?.user) {
    redirect('/login');
  }

  const programs = await getMyPrograms(session.user.id);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Program Saya</h1>
        <p className="text-muted-foreground">Detail program yang menjadi tanggung jawab Anda</p>
      </div>

      {programs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Anda belum memiliki program yang ditugaskan.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Program akan muncul di sini setelah Admin menugaskan Anda sebagai penanggung jawab.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {programs.map((program) => (
            <Card key={program.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{program.judul}</CardTitle>
                    <CardDescription className="mt-2">
                      Pilar: {program.pilar}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={getStatusBadgeVariant(program.status)}
                    className={getStatusBadgeClassName(program.status)}
                  >
                    {program.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Informasi Ringkas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="font-medium">{program.lokasiKecamatan}</p>
                      <p className="text-muted-foreground">{program.lokasiKabupaten}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="font-medium">Anggaran</p>
                      <p className="text-muted-foreground">
                        {new Intl.NumberFormat('id-ID', { 
                          style: 'currency', 
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                          notation: 'compact'
                        }).format(Number(program.anggaranFinal))}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="font-medium">Periode</p>
                      <p className="text-muted-foreground">
                        {new Date(program.tanggalMulaiFinal).toLocaleDateString('id-ID')} - {new Date(program.tanggalSelesaiFinal).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="font-medium">Penerima Manfaat</p>
                      <p className="text-muted-foreground">{program.jumlahPenerimaManfaat} orang</p>
                    </div>
                  </div>
                </div>

                {/* Detail Program */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Latar Belakang</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {program.latarBelakang}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Tujuan Program</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {program.tujuanProgram}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Target Penerima Manfaat</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {program.targetPenerimaManfaat}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}