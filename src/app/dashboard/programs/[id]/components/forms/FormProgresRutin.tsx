// app/dashboard/programs/[id]/components/forms/FormProgresRutin.tsx
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

const formSchema = z.object({
  deskripsiKegiatan: z.string().min(10, "Deskripsi kegiatan minimal 10 karakter."),
  persentaseProgres: z.coerce.number().min(0).max(100, "Persentase harus antara 0 dan 100."),
});

interface FormProps {
  programId: string;
  onFinished: () => void;
}

export function FormProgresRutin({ programId, onFinished }: FormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { deskripsiKegiatan: '', persentaseProgres: 0 },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programId: programId,
          tipeLaporan: LaporanType.PROGRES_RUTIN,
          data: values, // 'values' sudah sesuai struktur JSON yang kita inginkan
        }),
      });

      if (response.ok) {
        router.refresh(); // Muat ulang data di halaman
        onFinished(); // Reset form di komponen induk
        alert('Laporan progres rutin berhasil disimpan');
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
          name="deskripsiKegiatan" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi Kegiatan</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Jelaskan kegiatan yang telah dilakukan dalam periode ini..."
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        <FormField 
          control={form.control} 
          name="persentaseProgres" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Persentase Progres (%)</FormLabel>
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
        <Button type="submit">Kirim Laporan</Button>
      </form>
    </Form>
  );
}