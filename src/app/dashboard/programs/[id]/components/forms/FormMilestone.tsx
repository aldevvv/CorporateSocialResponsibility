// app/dashboard/programs/[id]/components/forms/FormMilestone.tsx
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
  namaMilestone: z.string().min(5, "Nama milestone minimal 5 karakter."),
  deskripsiPencapaian: z.string().min(10, "Deskripsi pencapaian minimal 10 karakter."),
  persentaseSelesai: z.coerce.number().min(0).max(100, "Persentase harus antara 0 dan 100."),
  statusMilestone: z.enum(['tercapai', 'terlambat', 'dalam_progres'], {
    message: "Status milestone harus dipilih.",
  }),
  tanggalTarget: z.string().min(1, "Tanggal target harus diisi."),
  tanggalRealisasi: z.string().optional(),
  catatan: z.string().optional(),
});

interface FormProps {
  programId: string;
  onFinished: () => void;
}

export function FormMilestone({ programId, onFinished }: FormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      namaMilestone: '',
      deskripsiPencapaian: '', 
      persentaseSelesai: 0,
      statusMilestone: undefined,
      tanggalTarget: '',
      tanggalRealisasi: '',
      catatan: ''
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programId: programId,
          tipeLaporan: LaporanType.PENCAPAIAN_MILESTONE,
          data: values,
        }),
      });

      if (response.ok) {
        router.refresh();
        onFinished();
        alert('Laporan milestone berhasil disimpan');
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
          name="namaMilestone" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Milestone</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Contoh: Penyelesaian Fase 1, Pelatihan Batch 1, dll."
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        <FormField 
          control={form.control} 
          name="deskripsiPencapaian" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi Pencapaian</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Jelaskan detail pencapaian milestone ini..."
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
            name="persentaseSelesai" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Persentase Selesai (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100" 
                    placeholder="0"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} 
          />

          <FormField 
            control={form.control} 
            name="statusMilestone" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status Milestone</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="tercapai">Tercapai</SelectItem>
                    <SelectItem value="dalam_progres">Dalam Progres</SelectItem>
                    <SelectItem value="terlambat">Terlambat</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField 
            control={form.control} 
            name="tanggalTarget" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Target</FormLabel>
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
            name="tanggalRealisasi" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Realisasi (Opsional)</FormLabel>
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
          name="catatan" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan Tambahan (Opsional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Catatan tambahan mengenai milestone ini..."
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />

        <Button type="submit">Kirim Laporan Milestone</Button>
      </form>
    </Form>
  );
}