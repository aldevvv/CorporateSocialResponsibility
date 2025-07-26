'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Schema validasi untuk form konversi
const konversiSchema = z.object({
  anggaranFinal: z.string().min(1, 'Anggaran final harus diisi'),
  tanggalMulaiFinal: z.string().min(1, 'Tanggal mulai harus diisi'),
  tanggalSelesaiFinal: z.string().min(1, 'Tanggal selesai harus diisi'),
  penanggungJawabId: z.string().min(1, 'Penanggung jawab harus dipilih'),
});

type KonversiFormData = z.infer<typeof konversiSchema>;

interface KonversiFormProps {
  proposal: any;
  users: any[];
}

export function KonversiForm({ proposal, users }: KonversiFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<KonversiFormData>({
    resolver: zodResolver(konversiSchema),
    defaultValues: {
      anggaranFinal: proposal.estimasiAnggaran.toString(),
      tanggalMulaiFinal: proposal.perkiraanMulai.toISOString().split('T')[0],
      tanggalSelesaiFinal: proposal.perkiraanSelesai.toISOString().split('T')[0],
      penanggungJawabId: '',
    },
  });

  const onSubmit = async (data: KonversiFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          proposal,
          anggaranFinal: parseFloat(data.anggaranFinal),
          tanggalMulaiFinal: new Date(data.tanggalMulaiFinal),
          tanggalSelesaiFinal: new Date(data.tanggalSelesaiFinal),
          penanggungJawabId: data.penanggungJawabId,
        }),
      });

      if (response.ok) {
        router.push('/dashboard/programs');
        router.refresh();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat mengkonversi proposal');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper untuk format mata uang
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Ringkasan Proposal */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Ringkasan Proposal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Judul:</strong> {proposal.judul}</p>
            <p><strong>Pilar TJSL:</strong> {proposal.pilar.replace(/_/g, ' ')}</p>
            <p><strong>Lokasi:</strong> {proposal.lokasiKecamatan}, {proposal.lokasiKabupaten}</p>
          </div>
          <div>
            <p><strong>Estimasi Anggaran:</strong> {formatCurrency(Number(proposal.estimasiAnggaran))}</p>
            <p><strong>Target Penerima:</strong> {proposal.jumlahPenerimaManfaat} Orang/KK</p>
          </div>
        </div>
      </div>

      {/* Form Konversi */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="anggaranFinal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anggaran Final (IDR)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Masukkan anggaran final"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="penanggungJawabId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Penanggung Jawab</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih penanggung jawab" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tanggalMulaiFinal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Mulai Final</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tanggalSelesaiFinal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Selesai Final</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Mengkonversi...' : 'Konversi ke Program'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}