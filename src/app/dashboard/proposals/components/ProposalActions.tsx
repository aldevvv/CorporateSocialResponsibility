'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProgramProposal, ProposalStatus } from '@prisma/client';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ProposalActionsProps {
  proposal: ProgramProposal;
}

export function ProposalActions({ proposal }: ProposalActionsProps) {
  const router = useRouter();

  // Jadikan fungsi ini lebih generik untuk menangani semua perubahan status
  const handleStatusChange = async (status: ProposalStatus) => {
    await fetch(`/api/proposals/${proposal.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  };
  
  const handleDelete = async () => {
    await fetch(`/api/proposals/${proposal.id}`, {
      method: 'DELETE',
    });
    router.refresh();
  };

  const handleGenerateTOR = async () => {
    try {
      const response = await fetch(`/api/proposals/${proposal.id}/generate-tor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `TOR_${proposal.judul.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to generate TOR');
        alert('Gagal generate TOR. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error generating TOR:', error);
      alert('Terjadi kesalahan saat generate TOR.');
    }
  };

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          
          {/* --- PERUBAHAN LOGIKA DI SINI --- */}

          {/* Aksi untuk status DRAFT */}
          {proposal.status === 'DRAFT' && (
            <>
              <DropdownMenuItem onClick={() => handleStatusChange('DIAJUKAN')}>
                Ajukan Proposal
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/dashboard/proposals/${proposal.id}/edit`)}
              >
                Edit
              </DropdownMenuItem>
              <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-red-600">
                    Hapus
                  </DropdownMenuItem>
              </AlertDialogTrigger>
            </>
          )}

          {/* Aksi untuk status DIAJUKAN */}
          {proposal.status === 'DIAJUKAN' && (
            <>
              <DropdownMenuItem onClick={() => handleStatusChange('DISETUJUI')}>
                Setujui
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('DITOLAK')} className="text-red-600">
                Tolak
              </DropdownMenuItem>
            </>
          )}

          {/* Aksi untuk status DISETUJUI */}
          {proposal.status === 'DISETUJUI' && (
            <>
              <DropdownMenuItem onClick={() => handleGenerateTOR()}>
                Generate TOR
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/proposals/${proposal.id}/konversi`}>
                  Konversi menjadi Program
                </Link>
              </DropdownMenuItem>
            </>
          )}

          {/* --- AKHIR PERUBAHAN LOGIKA --- */}

        </DropdownMenuContent>
      </DropdownMenu>

      {/* AlertDialog untuk konfirmasi hapus */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus proposal &ldquo;{proposal.judul}&rdquo;?
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Ya, Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}