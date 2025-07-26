// app/dashboard/proposals/page.tsx
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Import Button dari Shadcn
import { Badge } from '@/components/ui/badge'; // Import Badge dari Shadcn
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; // Import komponen Tabel dari Shadcn
import { ProposalActions } from './components/ProposalActions'; // <-- IMPORT BARU

const prisma = new PrismaClient();
// Fungsi untuk mendapatkan variant Badge berdasarkan status
function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'DRAFT':
      return 'secondary'; // Abu-abu
    case 'DIAJUKAN':
      return 'default'; // Biru
    case 'DISETUJUI':
      return 'default'; // Hijau (kita akan custom dengan className)
    case 'DITOLAK':
      return 'destructive'; // Merah
    case 'SELESAI':
      return 'default'; // Ungu (kita akan custom dengan className)
    default:
      return 'secondary';
  }
}

// Fungsi untuk mendapatkan className tambahan untuk warna custom
function getStatusBadgeClassName(status: string) {
  switch (status) {
    case 'DISETUJUI':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'SELESAI':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    default:
      return '';
  }
}

// Fungsi ini berjalan di server untuk mengambil data
async function getProposals() {
  const proposals = await prisma.programProposal.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: { // Kita sertakan data pembuatnya
        select: { name: true },
      },
    },
  });
  return proposals;
}

// Ini adalah Server Component, sangat efisien!
export default async function ProposalsPage() {
  const proposals = await getProposals();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Proposal Program</h1>
        <Button asChild>
          <Link href="/dashboard/proposals/new">+ Buat Proposal Baru</Link>
        </Button>
      </div>

      {/* Menggunakan komponen Tabel dari Shadcn */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul Program</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dibuat Oleh</TableHead>
              <TableHead>Tanggal Dibuat</TableHead>
              <TableHead className="text-right">Aksi</TableHead> {/* <-- KOLOM BARU */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {proposals.map((proposal) => (
              <TableRow key={proposal.id}>
                <TableCell className="font-medium">
                  <Link href={`/dashboard/proposals/${proposal.id}`} className="text-blue-600 hover:underline">
                    {proposal.judul}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={getStatusBadgeVariant(proposal.status)}
                    className={getStatusBadgeClassName(proposal.status)}
                  >
                    {proposal.status}
                  </Badge>
                </TableCell>
                <TableCell>{proposal.createdBy.name}</TableCell>
                <TableCell>
                  {new Date(proposal.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell className="text-right"> {/* <-- CELL BARU */}
                  <ProposalActions proposal={proposal} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}