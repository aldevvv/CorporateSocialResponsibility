// app/dashboard/programs/[id]/components/forms/FormKegiatanKhusus.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { LaporanType } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  namaKegiatan: z.string().min(5, "Nama kegiatan minimal 5 karakter."),
  deskripsiKegiatan: z.string().min(10, "Deskripsi kegiatan minimal 10 karakter."),
  tipeKegiatan: z.enum(['workshop', 'sosialisasi', 'monitoring', 'evaluasi', 'lainnya'], {
    required_error: "Tipe kegiatan harus dipilih.",
  }),
  lokasiKegiatan: z.string().min(3, "Lokasi kegiatan minimal 3 karakter."),
  jumlahPeserta: z.coerce.number().min(1, "Jumlah peserta minimal 1."),
  tanggalMulai: z.string().min(1, "Tanggal mulai harus diisi."),
  tanggalSelesai: z.string().min(1, "Tanggal selesai harus diisi."),
  hasilKegiatan: z.string().min(10, "Hasil kegiatan minimal 10 karakter."),
  kendalaKegiatan: z.string().optional(),
  rekomendasiTindakLanjut: z.string().optional(),
  biayaKegiatan: z.coerce.number().min(0, "Biaya tidak boleh negatif.").optional(),
});

interface FormProps {
  programId: string;
  onFinished: () => void;
}

export function FormKegiatanKhusus({ programId, onFinished }: FormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      namaKegiatan: '',
      deskripsiKegiatan: '', 
      tipeKegiatan: undefined,
      lokasiKegiatan: '',
      jumlahPeserta: 0,
      tanggalMulai: '',
      tanggalSelesai: '',
      hasilKegiatan: '',
      kendalaKegiatan: '',
      rekomendasiTindakLanjut: '',
      biayaKegiatan: 0
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programId: programId,
          tipeLaporan: LaporanType.KEGIATAN_KHUSUS,
          data: values,
        }),
      });

      if (response.ok) {
        router.refresh();
        onFinished();
        alert('Laporan kegiatan khusus berhasil disimpan');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat menyimpan laporan');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField 
          control={form.control} 
          name="namaKegiatan" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Kegiatan</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Contoh: Workshop Pelatihan, Sosialisasi Program, dll."
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        <FormField 
          control={form.control} 
          name="deskripsiKegiatan" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi Kegiatan</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Jelaskan detail kegiatan yang dilaksanakan..."
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField 
            control={form.control} 
            name="tipeKegiatan" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipe Kegiatan</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe kegiatan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="sosialisasi">Sosialisasi</SelectItem>
                    <SelectItem value="monitoring">Monitoring</SelectItem>
                    <SelectItem value="evaluasi">Evaluasi</SelectItem>
                    <SelectItem value="lainnya">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} 
          />

          <FormField 
            control={form.control} 
            name="jumlahPeserta" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jumlah Peserta</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1" 
                    placeholder="0"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />
        </div>

        <FormField 
          control={form.control} 
          name="lokasiKegiatan" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lokasi Kegiatan</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Contoh: Aula Desa, Kantor Kecamatan, Online, dll."
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField 
            control={form.control} 
            name="tanggalMulai" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Mulai</FormLabel>
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
            name="tanggalSelesai" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Selesai</FormLabel>
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

        <FormField 
          control={form.control} 
          name="hasilKegiatan" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hasil Kegiatan</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Jelaskan hasil dan pencapaian dari kegiatan ini..."
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />

        <FormField 
          control={form.control} 
          name="kendalaKegiatan" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kendala Kegiatan (Opsional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Sebutkan kendala yang dihadapi selama kegiatan..."
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />

        <FormField 
          control={form.control} 
          name="rekomendasiTindakLanjut" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rekomendasi Tindak Lanjut (Opsional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Berikan rekomendasi untuk tindak lanjut kegiatan..."
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />

        <FormField 
          control={form.control} 
          name="biayaKegiatan" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biaya Kegiatan (IDR) - Opsional</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  placeholder="0"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />

        <Button type="submit">Kirim Laporan Kegiatan</Button>
      </form>
    </Form>
  );
}