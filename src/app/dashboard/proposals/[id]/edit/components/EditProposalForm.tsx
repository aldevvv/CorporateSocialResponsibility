// app/dashboard/proposals/[id]/edit/components/EditProposalForm.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { ProgramProposal } from '@prisma/client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Skema validasi sama seperti form 'Buat Baru'
const formSchema = z.object({
  judul: z.string().min(10, { message: 'Judul program minimal harus 10 karakter.' }),
  latarBelakang: z.string().min(20, { message: 'Latar belakang minimal harus 20 karakter.' }),
  tujuanProgram: z.string().min(20, { message: 'Tujuan program minimal harus 20 karakter.' }),
});

interface EditProposalFormProps {
  proposal: ProgramProposal;
}

export function EditProposalForm({ proposal }: EditProposalFormProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // PENTING: Isi form dengan data yang ada dari proposal
    defaultValues: {
      judul: proposal.judul || '',
      latarBelakang: proposal.latarBelakang || '',
      tujuanProgram: proposal.tujuanProgram || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Panggil API PATCH ke endpoint spesifik
      const response = await fetch(`/api/proposals/${proposal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Gagal memperbarui proposal');
      }

      router.push('/dashboard/proposals');
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="judul"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul Program</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="latarBelakang"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Latar Belakang</FormLabel>
              <FormControl>
                <Textarea className="resize-none" rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tujuanProgram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tujuan Program</FormLabel>
              <FormControl>
                <Textarea className="resize-none" rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit">Simpan Perubahan</Button>
        </div>
      </form>
    </Form>
  );
}