// app/dashboard/settings/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

// Skema Zod yang lengkap
const formSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter."),
  email: z.string().email("Format email tidak valid."),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
}).refine(data => {
  // Jika newPassword diisi, currentPassword juga harus diisi
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "Password saat ini diperlukan untuk mengatur password baru.",
  path: ["currentPassword"],
});

export default function SettingsPage() {
  const { data: session, status, update: updateSession } = useSession();
  const [newImageFile, setNewImageFile] = useState<File | null>(null); // Simpan file, bukan Base64
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Untuk preview
  const [isSaving, setIsSaving] = useState(false);
  const [serverError, setServerError] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // Default values akan di-set oleh useEffect di bawah
  });

  // Mengisi form dengan data sesi setelah sesi selesai dimuat
  useEffect(() => {
    if (session) {
      form.reset({
        name: session.user?.name || '',
        email: session.user?.email || '',
        currentPassword: '',
        newPassword: '',
      });
    }
  }, [session, form]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewImageFile(file); // Simpan object File
      setImagePreview(URL.createObjectURL(file)); // Buat URL sementara untuk preview
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true);
    setServerError('');

    if (values.email !== session?.user?.email && !values.currentPassword) {
        form.setError("currentPassword", { type: "manual", message: "Password saat ini diperlukan untuk mengubah email." });
        setIsSaving(false);
        return;
    }

    let finalImageUrl = session?.user?.image || null;

    try {
      // Langkah 1: Jika ada foto profil baru, upload dulu
      if (newImageFile) {
        const formData = new FormData();
        formData.append('file', newImageFile);
        
        const avatarRes = await fetch('/api/account/avatar', {
          method: 'POST',
          body: formData,
        });

        if (!avatarRes.ok) {
          const avatarError = await avatarRes.json();
          throw new Error(avatarError.error || "Gagal upload avatar");
        }
        const avatarData = await avatarRes.json();
        finalImageUrl = avatarData.url; // Dapatkan URL baru dari server
      }

      // Langkah 2: Kirim data teks (nama, email, password)
      const accountRes = await fetch('/api/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      if (!accountRes.ok) {
        const result = await accountRes.json();
        throw new Error(result.error || "Gagal menyimpan data akun");
      }

      // Langkah 3: Perbarui sesi dengan data terbaru
      await updateSession({ 
        user: { 
          ...session?.user, 
          name: values.name,
          email: values.email,
          image: finalImageUrl,
        } 
      });
      
      alert("Pengaturan berhasil disimpan!");
      form.reset({ ...values, currentPassword: '', newPassword: '' });
      setNewImageFile(null);
      setImagePreview(null);

    } catch (error) {
      setServerError((error as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  if (status === "loading") {
    return <div className="p-6 text-center">Memuat data pengguna...</div>;
  }

  if (!session) {
    return <div className="p-6 text-center">Anda harus login untuk mengakses halaman ini.</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pengaturan Akun</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={imagePreview || session.user?.image || ''} alt={session.user?.name || ''} />
              <AvatarFallback>{session.user?.name?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className='w-full space-y-2'>
              <Label htmlFor="picture">Foto Profil</Label>
              <Input id="picture" type="file" accept="image/*" onChange={handleImageChange} />
              <p className="text-sm text-gray-500">Maksimal 5MB. Format: JPEG, PNG, WebP</p>
            </div>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="Nama Anda" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <h3 className="text-lg font-semibold">Ubah Kredensial</h3>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat Email</FormLabel>
                <FormControl><Input type="email" placeholder="Email Anda" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password Baru</FormLabel>
                <FormControl><Input type="password" placeholder="Kosongkan jika tidak ingin mengubah" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verifikasi dengan Password Saat Ini</FormLabel>
                <FormControl><Input type="password" placeholder="Masukkan password saat ini untuk menyimpan" {...field} /></FormControl>
                <FormDescription>Diperlukan jika Anda mengubah email atau password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {serverError && <p className="text-sm font-medium text-destructive">{serverError}</p>}

          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </form>
      </Form>
    </div>
  );
}