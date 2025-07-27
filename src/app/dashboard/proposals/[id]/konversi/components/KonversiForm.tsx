'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  MapPin, 
  DollarSign, 
  Calendar, 
  User, 
  Save, 
  X,
  Target,
  Users
} from 'lucide-react';

// Schema validasi untuk form konversi
const konversiSchema = z.object({
  anggaranFinal: z.string().min(1, 'Anggaran final harus diisi'),
  tanggalMulaiFinal: z.string().min(1, 'Tanggal mulai harus diisi'),
  tanggalSelesaiFinal: z.string().min(1, 'Tanggal selesai harus diisi'),
  penanggungJawabId: z.string().min(1, 'Penanggung jawab harus dipilih'),
});

type KonversiFormData = z.infer<typeof konversiSchema>;

interface KonversiFormProps {
  proposal: {
    id: string;
    judul: string;
    pilar: string;
    lokasiKecamatan: string;
    lokasiKabupaten: string;
    estimasiAnggaran: number;
    jumlahPenerimaManfaat: number;
    perkiraanMulai: Date;
    perkiraanSelesai: Date;
  };
  users: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

export function KonversiForm({ proposal, users }: KonversiFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<KonversiFormData>({
    resolver: zodResolver(konversiSchema),
    defaultValues: {
      anggaranFinal: proposal.estimasiAnggaran.toString(),
      tanggalMulaiFinal: new Date(proposal.perkiraanMulai).toISOString().split('T')[0],
      tanggalSelesaiFinal: new Date(proposal.perkiraanSelesai).toISOString().split('T')[0],
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
    <div className="p-6 space-y-8">
      {/* Ringkasan Proposal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Ringkasan Proposal</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FileText className="h-4 w-4 text-gray-500 mt-1" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Judul Program</div>
                  <div className="text-base font-semibold">{proposal.judul}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Target className="h-4 w-4 text-gray-500 mt-1" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Pilar TJSL</div>
                  <div className="text-base">{proposal.pilar.replace(/_/g, ' ')}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Lokasi</div>
                  <div className="text-base">{proposal.lokasiKecamatan}, {proposal.lokasiKabupaten}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <DollarSign className="h-4 w-4 text-gray-500 mt-1" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Estimasi Anggaran</div>
                  <div className="text-base font-semibold text-green-600">
                    {formatCurrency(Number(proposal.estimasiAnggaran))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Users className="h-4 w-4 text-gray-500 mt-1" />
                <div>
                  <div className="text-sm font-medium text-gray-500">Target Penerima Manfaat</div>
                  <div className="text-base">{proposal.jumlahPenerimaManfaat} Orang/KK</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Konversi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-green-600" />
            <span>Finalisasi Program</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="anggaranFinal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span>Anggaran Final (IDR)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Masukkan anggaran final"
                          {...field}
                        />
                      </FormControl>
                      <div className="text-sm text-gray-600">
                        {field.value && `≈ ${formatCurrency(parseFloat(field.value) || 0)}`}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="penanggungJawabId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span>Penanggung Jawab</span>
                      </FormLabel>
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
                      <FormLabel className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-orange-600" />
                        <span>Tanggal Mulai Final</span>
                      </FormLabel>
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
                      <FormLabel className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-red-600" />
                        <span>Tanggal Selesai Final</span>
                      </FormLabel>
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

              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Batal</span>
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{isLoading ? 'Mengkonversi...' : 'Konversi ke Program'}</span>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}