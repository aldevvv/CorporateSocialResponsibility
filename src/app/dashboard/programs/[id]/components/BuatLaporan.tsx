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

  const laporanTypeLabels = {
    PROGRES_RUTIN: 'Laporan Progres Rutin',
    KEUANGAN: 'Laporan Keuangan',
    PENCAPAIAN_MILESTONE: 'Pencapaian Milestone',
    INSIDEN_KENDALA: 'Insiden & Kendala',
    KEGIATAN_KHUSUS: 'Kegiatan Khusus'
  };

  const laporanTypeDescriptions = {
    PROGRES_RUTIN: 'Laporan berkala mengenai kemajuan program secara keseluruhan',
    KEUANGAN: 'Laporan penggunaan anggaran dan realisasi keuangan program',
    PENCAPAIAN_MILESTONE: 'Laporan pencapaian target dan milestone penting',
    INSIDEN_KENDALA: 'Laporan masalah, kendala, atau insiden yang terjadi',
    KEGIATAN_KHUSUS: 'Laporan kegiatan khusus atau event tertentu'
  };

  return (
    <div className="space-y-8">
      {/* Report Type Selection */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Pilih Jenis Laporan</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Pilih jenis laporan yang ingin Anda buat untuk program ini. Setiap jenis laporan memiliki format dan informasi yang berbeda.
          </p>
        </div>

        {/* Report Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(LaporanType).map((tipe) => (
            <div
              key={tipe}
              onClick={() => setTipeLaporan(tipe)}
              className={`
                relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg
                ${tipeLaporan === tipe
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-300'
                }
              `}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                  ${tipeLaporan === tipe ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}
                `}>
                  {tipe === 'PROGRES_RUTIN' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )}
                  {tipe === 'KEUANGAN' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  )}
                  {tipe === 'PENCAPAIAN_MILESTONE' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {tipe === 'INSIDEN_KENDALA' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  )}
                  {tipe === 'KEGIATAN_KHUSUS' && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h6m-6 0l-.5 8.5A2 2 0 0013.5 21h-3A2 2 0 018.5 15.5L8 7z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-semibold text-sm mb-1 ${tipeLaporan === tipe ? 'text-blue-900' : 'text-gray-900'}`}>
                    {laporanTypeLabels[tipe as keyof typeof laporanTypeLabels]}
                  </h4>
                  <p className={`text-xs leading-relaxed ${tipeLaporan === tipe ? 'text-blue-700' : 'text-gray-600'}`}>
                    {laporanTypeDescriptions[tipe as keyof typeof laporanTypeDescriptions]}
                  </p>
                </div>
              </div>
              
              {tipeLaporan === tipe && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Alternative Select for Mobile */}
        <div className="md:hidden">
          <Select onValueChange={(value) => setTipeLaporan(value as LaporanType)} value={tipeLaporan}>
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="Atau pilih dari dropdown..." />
            </SelectTrigger>
            <SelectContent>
              {Object.values(LaporanType).map((tipe) => (
                <SelectItem key={tipe} value={tipe}>
                  {laporanTypeLabels[tipe as keyof typeof laporanTypeLabels]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Form Section */}
      {tipeLaporan && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-xl font-bold text-gray-900">
                {laporanTypeLabels[tipeLaporan as keyof typeof laporanTypeLabels]}
              </h4>
              <p className="text-gray-600 mt-1">
                Isi formulir di bawah ini untuk membuat laporan
              </p>
            </div>
            <button
              onClick={() => setTipeLaporan('')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              title="Tutup formulir"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {renderForm()}
          </div>
        </div>
      )}
    </div>
  );
}