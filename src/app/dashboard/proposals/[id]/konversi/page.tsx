// app/dashboard/proposals/[id]/konversi/page.tsx
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { KonversiForm } from './components/KonversiForm';
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

export default async function KonversiPage({ params }: { params: { id: string } }) {
  const { proposal, users } = await getData(params.id);

  if (!proposal || proposal.status !== 'DISETUJUI') {
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
              <BreadcrumbLink asChild>
                <Link href={`/dashboard/proposals/${params.id}`}>{proposal?.judul || 'Proposal'}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Konversi</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="p-6 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold text-red-600">Akses Ditolak</h1>
          <p className="text-gray-600 mt-2">Hanya proposal yang berstatus DISETUJUI yang bisa dikonversi.</p>
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
              <Link href="/dashboard/proposals">Proposal Program</Link>
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

      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-2">Konversi Menjadi Program Resmi</h1>
        <p className="text-muted-foreground mb-6">Finalisasi detail untuk program "{proposal.judul}" sebelum dieksekusi.</p>
        <KonversiForm proposal={proposal} users={users} />
      </div>
    </div>
  );
}