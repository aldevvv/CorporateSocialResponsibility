// app/dashboard/programs/page.tsx
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Program Berjalan</h1>
          <p className="text-muted-foreground">Daftar program yang sedang aktif dan dijalankan</p>
        </div>
      </div>

      {programs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Belum ada program yang berjalan.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Program akan muncul di sini setelah proposal disetujui dan dikonversi.
          </p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul Program</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Penanggung Jawab</TableHead>
                <TableHead>Anggaran</TableHead>
                <TableHead>Jadwal</TableHead>
                <TableHead>Asal Proposal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.map((program) => (
                <TableRow key={program.id}>
                  <TableCell className="font-medium">
                    <div>
                      <Link
                        href={`/dashboard/programs/${program.id}`}
                        className="font-semibold text-[#1E40AF] hover:text-[#1E3A8A] hover:underline transition-colors duration-200"
                      >
                        {program.judul}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {program.pilar.replace(/_/g, ' ')} • {program.lokasiKecamatan}, {program.lokasiKabupaten}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusBadgeVariant(program.status)}
                      className={getStatusBadgeClassName(program.status)}
                    >
                      {program.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{program.penanggungJawab.name}</p>
                      <p className="text-sm text-muted-foreground">{program.penanggungJawab.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{formatCurrency(Number(program.anggaranFinal))}</p>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p><strong>Mulai:</strong> {formatDate(program.tanggalMulaiFinal)}</p>
                      <p><strong>Selesai:</strong> {formatDate(program.tanggalSelesaiFinal)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{program.proposalAsal.judul}</p>
                      <p className="text-muted-foreground">oleh {program.proposalAsal.createdBy.name}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}