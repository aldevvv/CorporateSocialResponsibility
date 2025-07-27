// app/dashboard/proposals/[id]/edit/page.tsx
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProposalForm } from '../../components/ProposalForm';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const prisma = new PrismaClient();

async function getProposal(id: string) {
  try {
    const proposal = await prisma.programProposal.findUnique({
      where: { id },
    });
    return proposal;
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return null;
  }
}

export default async function EditProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const proposal = await getProposal(resolvedParams.id);

  if (!proposal) {
    notFound();
  }

  // Hanya proposal dengan status DRAFT yang bisa diedit
  if (proposal.status !== 'DRAFT') {
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
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6 text-red-600">Tidak Dapat Mengedit</h1>
          <p className="text-gray-600">
            Proposal dengan status &ldquo;{proposal.status}&rdquo; tidak dapat diedit.
            Hanya proposal dengan status &ldquo;DRAFT&rdquo; yang dapat diedit.
          </p>
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
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Edit Proposal Program</h1>
        <ProposalForm initialData={proposal} />
      </div>
    </div>
  );
}