// app/dashboard/programs/[id]/components/forms/FormKeuangan.tsx
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
  deskripsiTransaksi: z.string().min(10, "Deskripsi transaksi minimal 10 karakter."),
  jumlah: z.coerce.number().min(1, "Jumlah harus lebih dari 0."),
  tipe: z.enum(['pemasukan', 'pengeluaran'], {
    required_error: "Tipe transaksi harus dipilih.",
  }),
  urlBukti: z.string().optional(),
});

interface FormProps {
  programId: string;
  onFinished: () => void;
}

export function FormKeuangan({ programId, onFinished }: FormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      deskripsiTransaksi: '', 
      jumlah: 0, 
      tipe: undefined,
      urlBukti: '' 
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programId: programId,
          tipeLaporan: LaporanType.KEUANGAN,
          data: values,
        }),
      });

      if (response.ok) {
        router.refresh();
        onFinished();
        alert('Laporan keuangan berhasil disimpan');
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
          name="deskripsiTransaksi" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi Transaksi</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Jelaskan detail transaksi keuangan..."
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        <FormField 
          control={form.control} 
          name="tipe" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipe Transaksi</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe transaksi" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pemasukan">Pemasukan</SelectItem>
                  <SelectItem value="pengeluaran">Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} 
        />
        <FormField 
          control={form.control} 
          name="jumlah" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah (IDR)</FormLabel>
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
        <FormField 
          control={form.control} 
          name="urlBukti" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Bukti (Opsional)</FormLabel>
              <FormControl>
                <Input 
                  type="url" 
                  placeholder="https://..."
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