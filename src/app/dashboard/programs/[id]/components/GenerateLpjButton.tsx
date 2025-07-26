// app/dashboard/programs/[id]/components/GenerateLpjButton.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Program, LaporanProgres, User } from '@prisma/client';
import { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { LpjDocument } from '../../components/LpjDocument';

type ProgramWithDetails = Program & {
  penanggungJawab: User;
  laporanProgres: (LaporanProgres & { createdBy: User })[];
};

export function GenerateLpjButton({ program }: { program: ProgramWithDetails }) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => { 
    setIsClient(true);
  }, []);

  if (program.status !== 'SELESAI') return null;

  return (
    <div>
      {isClient && (
        <PDFDownloadLink
          document={<LpjDocument program={program} />}
          fileName={`LPJ - ${program.judul.replace(/ /g, '_')}.pdf`}
        >
          {({ loading }) => (
            <Button 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Menyiapkan LPJ...' : 'Generate LPJ (PDF)'}
            </Button>
          )}
        </PDFDownloadLink>
      )}
    </div>
  );
}