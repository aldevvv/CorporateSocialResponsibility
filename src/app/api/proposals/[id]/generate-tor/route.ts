import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import { TorDocument } from '@/app/dashboard/proposals/[id]/edit/components/TorDocuments';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const proposal = await prisma.programProposal.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    });

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    if (proposal.status !== 'DISETUJUI') {
      return NextResponse.json({ error: 'Proposal must be approved to generate TOR' }, { status: 400 });
    }

    // Generate PDF using TorDocument component
    const pdfBuffer = await renderToBuffer(React.createElement(TorDocument, { proposal }));

    // Return PDF as downloadable file
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="TOR_${proposal.judul.replace(/\s+/g, '_')}.pdf"`
      }
    });

  } catch (error) {
    console.error('Error generating TOR:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}