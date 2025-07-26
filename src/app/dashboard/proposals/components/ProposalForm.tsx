// app/dashboard/proposals/components/ProposalForm.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ProgramProposal, TjslPillar } from '@prisma/client';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

// Skema Zod yang lengkap
const formSchema = z.object({
  judul: z.string().min(10, { message: 'Judul minimal 10 karakter.' }),
  pilar: z.nativeEnum(TjslPillar, { required_error: 'Pilar TJSL harus dipilih.' }),
  ringkasan: z.string().optional(),
  lokasiKabupaten: z.string().min(3, { message: 'Lokasi kabupaten wajib diisi.' }),
  lokasiKecamatan: z.string().min(3, { message: 'Lokasi kecamatan wajib diisi.' }),
  lokasiDesa: z.string().optional(),
  latarBelakang: z.string().min(50, { message: 'Latar belakang minimal 50 karakter.' }),
  tujuanProgram: z.string().min(20, { message: 'Tujuan program minimal 20 karakter.' }),
  indikatorKeberhasilan: z.string().min(20, { message: 'Indikator keberhasilan wajib diisi.' }),
  targetPenerimaManfaat: z.string().min(10, { message: 'Target penerima manfaat wajib diisi.' }),
  jumlahPenerimaManfaat: z.coerce.number().int().positive({ message: 'Jumlah harus angka positif.' }),
  estimasiAnggaran: z.coerce.number().positive({ message: 'Anggaran harus angka positif.' }),
  perkiraanMulai: z.date({ required_error: 'Tanggal mulai wajib diisi.' }),
  perkiraanSelesai: z.date({ required_error: 'Tanggal selesai wajib diisi.' }),
}).refine((data) => data.perkiraanSelesai > data.perkiraanMulai, {
  message: "Tanggal selesai harus setelah tanggal mulai",
  path: ["perkiraanSelesai"],
});

interface ProposalFormProps {
  initialData?: ProgramProposal; // Prop opsional untuk mode edit
}

export function ProposalForm({ initialData }: ProposalFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isEditMode
      ? {
          ...initialData,
          estimasiAnggaran: Number(initialData.estimasiAnggaran), // Konversi Decimal ke number
          jumlahPenerimaManfaat: initialData.jumlahPenerimaManfaat,
          perkiraanMulai: new Date(initialData.perkiraanMulai),
          perkiraanSelesai: new Date(initialData.perkiraanSelesai),
        }
      : {
          judul: '',
          ringkasan: '',
          lokasiKabupaten: '',
          lokasiKecamatan: '',
          lokasiDesa: '',
          latarBelakang: '',
          tujuanProgram: '',
          indikatorKeberhasilan: '',
          targetPenerimaManfaat: '',
          jumlahPenerimaManfaat: 0,
          estimasiAnggaran: 0,
        },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const url = isEditMode ? `/api/proposals/${initialData.id}` : '/api/proposals';
      const method = isEditMode ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Gagal ${isEditMode ? 'memperbarui' : 'menyimpan'} proposal`);
      }

      router.push('/dashboard/proposals');
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Informasi Dasar */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">Informasi Dasar</h3>
          
          <FormField
            control={form.control}
            name="judul"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Judul Program</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: Program Pemberdayaan UKM di Desa A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pilar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pilar TJSL</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih pilar program..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(TjslPillar).map(pilar => (
                      <SelectItem key={pilar} value={pilar}>
                        {pilar.replace(/_/g, ' ')}
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
            name="ringkasan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ringkasan Program (Opsional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ringkasan singkat tentang program ini..."
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="lokasiKabupaten"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kabupaten/Kota</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Kabupaten Bandung" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lokasiKecamatan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kecamatan</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: Kecamatan Cicalengka" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="lokasiDesa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Desa/Kelurahan (Opsional)</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: Desa Sukamaju" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Detail & Justifikasi */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">Detail & Justifikasi</h3>
          
          <FormField
            control={form.control}
            name="latarBelakang"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latar Belakang</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Jelaskan kondisi atau masalah yang melatarbelakangi program ini..."
                    className="resize-none"
                    rows={5}
                    {...field}
                  />
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
                  <Textarea
                    placeholder="Jelaskan tujuan dan hasil yang diharapkan dari program ini..."
                    className="resize-none"
                    rows={5}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Target & Pengukuran */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">Target & Pengukuran</h3>
          
          <FormField
            control={form.control}
            name="indikatorKeberhasilan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Indikator Keberhasilan</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tuliskan indikator-indikator yang akan digunakan untuk mengukur keberhasilan program..."
                    className="resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetPenerimaManfaat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Penerima Manfaat</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Jelaskan siapa saja yang akan menjadi penerima manfaat dari program ini..."
                    className="resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jumlahPenerimaManfaat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jumlah Penerima Manfaat</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Contoh: 100" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Anggaran & Jadwal */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">Anggaran & Jadwal</h3>
          
          <FormField
            control={form.control}
            name="estimasiAnggaran"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimasi Anggaran (Rupiah)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Contoh: 50000000" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <div className="text-sm text-gray-600">
                  {field.value > 0 && `≈ ${formatCurrency(field.value)}`}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="perkiraanMulai"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Perkiraan Tanggal Mulai</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="perkiraanSelesai"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Perkiraan Tanggal Selesai</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
          <Button type="submit">
            {isEditMode ? 'Simpan Perubahan' : 'Simpan sebagai Draft'}
          </Button>
        </div>
      </form>
    </Form>
  );
}