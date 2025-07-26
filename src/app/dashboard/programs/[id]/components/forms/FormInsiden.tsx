// app/dashboard/programs/[id]/components/forms/FormInsiden.tsx
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
  judulInsiden: z.string().min(5, "Judul insiden minimal 5 karakter."),
  deskripsiMasalah: z.string().min(10, "Deskripsi masalah minimal 10 karakter."),
  tingkatKeparahan: z.enum(['rendah', 'sedang', 'tinggi', 'kritis'], {
    required_error: "Tingkat keparahan harus dipilih.",
  }),
  dampakProgram: z.string().min(10, "Dampak terhadap program minimal 10 karakter."),
  tindakanDilakukan: z.string().min(10, "Tindakan yang dilakukan minimal 10 karakter."),
  statusPenyelesaian: z.enum(['baru', 'dalam_penanganan', 'selesai'], {
    required_error: "Status penyelesaian harus dipilih.",
  }),
  tanggalKejadian: z.string().min(1, "Tanggal kejadian harus diisi."),
  estimasiSelesai: z.string().optional(),
  pihakTerlibat: z.string().optional(),
});

interface FormProps {
  programId: string;
  onFinished: () => void;
}

export function FormInsiden({ programId, onFinished }: FormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      judulInsiden: '',
      deskripsiMasalah: '', 
      tingkatKeparahan: undefined,
      dampakProgram: '',
      tindakanDilakukan: '',
      statusPenyelesaian: undefined,
      tanggalKejadian: '',
      estimasiSelesai: '',
      pihakTerlibat: ''
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programId: programId,
          tipeLaporan: LaporanType.INSIDEN_KENDALA,
          data: values,
        }),
      });

      if (response.ok) {
        router.refresh();
        onFinished();
        alert('Laporan insiden berhasil disimpan');
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
          name="judulInsiden" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul Insiden/Kendala</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Contoh: Keterlambatan pengiriman material, Masalah cuaca, dll."
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        <FormField 
          control={form.control} 
          name="deskripsiMasalah" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi Masalah</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Jelaskan detail masalah yang terjadi..."
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
            name="tingkatKeparahan" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tingkat Keparahan</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tingkat keparahan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="rendah">Rendah</SelectItem>
                    <SelectItem value="sedang">Sedang</SelectItem>
                    <SelectItem value="tinggi">Tinggi</SelectItem>
                    <SelectItem value="kritis">Kritis</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} 
          />

          <FormField 
            control={form.control} 
            name="statusPenyelesaian" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Penyelesaian</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="baru">Baru</SelectItem>
                    <SelectItem value="dalam_penanganan">Dalam Penanganan</SelectItem>
                    <SelectItem value="selesai">Selesai</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} 
          />
        </div>

        <FormField 
          control={form.control} 
          name="dampakProgram" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dampak Terhadap Program</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Jelaskan dampak insiden ini terhadap jalannya program..."
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />

        <FormField 
          control={form.control} 
          name="tindakanDilakukan" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tindakan yang Dilakukan</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Jelaskan tindakan yang sudah atau akan dilakukan untuk mengatasi masalah..."
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
            name="tanggalKejadian" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Kejadian</FormLabel>
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
            name="estimasiSelesai" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimasi Selesai (Opsional)</FormLabel>
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
          name="pihakTerlibat" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pihak Terlibat (Opsional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Sebutkan pihak-pihak yang terlibat dalam penanganan insiden..."
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />

        <Button type="submit">Kirim Laporan Insiden</Button>
      </form>
    </Form>
  );
}