// app/dashboard/programs/[id]/components/BuatLaporan.tsx
'use client';

import { useState } from 'react';
import { LaporanType } from '@prisma/client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormProgresRutin } from './forms/FormProgresRutin';
import { FormKeuangan } from './forms/FormKeuangan';
import { FormMilestone } from './forms/FormMilestone';
import { FormInsiden } from './forms/FormInsiden';
import { FormKegiatanKhusus } from './forms/FormKegiatanKhusus';

interface BuatLaporanProps {
  programId: string;
}

export function BuatLaporan({ programId }: BuatLaporanProps) {
  const [tipeLaporan, setTipeLaporan] = useState<LaporanType | ''>('');

  const renderForm = () => {
    switch (tipeLaporan) {
      case 'PROGRES_RUTIN':
        return <FormProgresRutin programId={programId} onFinished={() => setTipeLaporan('')} />;
      case 'KEUANGAN':
        return <FormKeuangan programId={programId} onFinished={() => setTipeLaporan('')} />;
      case 'PENCAPAIAN_MILESTONE':
        return <FormMilestone programId={programId} onFinished={() => setTipeLaporan('')} />;
      case 'INSIDEN_KENDALA':
        return <FormInsiden programId={programId} onFinished={() => setTipeLaporan('')} />;
      case 'KEGIATAN_KHUSUS':
        return <FormKegiatanKhusus programId={programId} onFinished={() => setTipeLaporan('')} />;
      default:
        return null;
    }
  };

  return (
    <div className="mb-8 p-4 border rounded-md">
      <h3 className="font-semibold mb-2">Buat Laporan Baru</h3>
      <Select onValueChange={(value) => setTipeLaporan(value as LaporanType)}>
        <SelectTrigger>
          <SelectValue placeholder="Pilih jenis laporan..." />
        </SelectTrigger>
        <SelectContent>
          {Object.values(LaporanType).map((tipe) => (
            <SelectItem key={tipe} value={tipe}>
              {tipe.replace(/_/g, ' ')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="mt-4">
        {renderForm()}
      </div>
    </div>
  );
}