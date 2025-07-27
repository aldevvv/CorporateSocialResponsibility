// app/dashboard/guides/admin/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminGuidePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      router.push('/login');
      return;
    }

    if (session.user.role !== 'ADMIN') {
      router.push('/dashboard/guides');
      return;
    }
  }, [session, status, router]);

  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!session || session.user.role !== 'ADMIN') {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              Akses Ditolak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">
              Anda tidak memiliki izin untuk mengakses panduan administrator. 
              Halaman ini hanya tersedia untuk pengguna dengan role Administrator.
            </p>
            <Button 
              onClick={() => router.push('/dashboard/guides')}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100"
            >
              Kembali ke Panduan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show admin guide content
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-[#1E40AF]" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panduan Administrator</h1>
          <p className="text-gray-600">Panduan lengkap untuk administrator sistem PLN UIP Kota Makassar</p>
        </div>
      </div>

      {/* Guide Content */}
      <div className="prose prose-lg max-w-none">
        <h1>Panduan Lengkap untuk Admin</h1>
        
        <p>Selamat datang di panduan untuk Admin Sistem Informasi Manajemen (SIM) TJSL. Dokumen ini akan memandu Anda melalui semua fitur dan alur kerja utama dari awal hingga akhir.</p>
        
        <hr />
        
        <h2>1. Dashboard Utama (Overview)</h2>
        
        <p>Saat pertama kali login, Anda akan disambut oleh halaman <strong>Dashboard Overview</strong>. Halaman ini memberikan ringkasan strategis dari seluruh portofolio program TJSL.</p>
        
        <ul>
          <li><strong>Kartu Metrik Utama:</strong> Menampilkan angka-angka kunci seperti Total Program Aktif dan Total Anggaran yang Dialokasikan.</li>
          <li><strong>Grafik Analitik:</strong> Memberikan visualisasi data, seperti Alokasi Anggaran per Pilar TJSL, untuk membantu Anda melihat tren dan membuat keputusan.</li>
        </ul>
        
        <hr />
        
        <h2>2. Siklus Hidup Proposal (Tahap 1)</h2>
        
        <p>Ini adalah alur kerja utama untuk mengelola usulan program dari ide hingga persetujuan. Semua ini terjadi di menu <strong>&ldquo;Manajemen Proposal&rdquo;</strong>.</p>
        
        <h3>Langkah 1: Membuat Proposal Baru</h3>
        <ol>
          <li>Klik menu <strong>&ldquo;Manajemen Proposal&rdquo;</strong> di sidebar.</li>
          <li>Klik tombol <strong>&ldquo;+ Buat Proposal Baru&rdquo;</strong> di pojok kanan atas.</li>
          <li>Isi formulir secara lengkap dan detail. Semua field wajib diisi untuk memastikan kualitas data.</li>
          <li>Klik <strong>&ldquo;Simpan sebagai Draft&rdquo;</strong>. Proposal Anda kini tersimpan di sistem dengan status <code>DRAFT</code>.</li>
        </ol>
        
        <h3>Langkah 2: Mengajukan & Memantau Status Proposal</h3>
        <p>Di halaman daftar proposal, Anda akan melihat <strong>Badge Status</strong> berwarna untuk setiap proposal:</p>
        <ul>
          <li><code>DRAFT</code>: Proposal masih dalam tahap pengisian dan belum diajukan.</li>
          <li><code>DIAJUKAN</code>: Proposal sudah final dan menunggu persetujuan.</li>
          <li><code>DISETUJUI</code>: Proposal telah disetujui dan siap dikonversi menjadi program.</li>
          <li><code>DITOLAK</code>: Proposal ditolak.</li>
          <li><code>DIJALANKAN</code>: Proposal sudah dikonversi menjadi program aktif.</li>
        </ul>
        
        <p>Untuk mengajukan proposal:</p>
        <ol>
          <li>Cari proposal yang berstatus <code>DRAFT</code>.</li>
          <li>Klik <strong>ikon tiga titik (menu aksi)</strong> di ujung kanan barisnya.</li>
          <li>Pilih <strong>&ldquo;Ajukan Proposal&rdquo;</strong>. Status akan berubah menjadi <code>DIAJUKAN</code>.</li>
        </ol>
        
        <h3>Langkah 3: Menyetujui atau Menolak Proposal</h3>
        <p>Hanya proposal dengan status <code>DIAJUKAN</code> yang bisa dievaluasi.</p>
        <ol>
          <li>Buka halaman <strong>Detail Proposal</strong> dengan mengklik judulnya, atau gunakan <strong>menu aksi</strong>.</li>
          <li>Setelah mengevaluasi semua detail, pilih salah satu aksi:
            <ul>
              <li><strong>&ldquo;Setujui&rdquo;</strong>: Untuk menerima proposal. Status akan berubah menjadi <code>DISETUJUI</code>.</li>
              <li><strong>&ldquo;Tolak&rdquo;</strong>: Untuk menolak proposal. Status akan berubah menjadi <code>DITOLAK</code>.</li>
            </ul>
          </li>
        </ol>
        
        <h3>Langkah 4: Generate Dokumen TOR</h3>
        <p>Setelah proposal disetujui, sistem dapat membuatkan dokumen TOR (Term of Reference) secara otomatis.</p>
        <ol>
          <li>Cari proposal yang berstatus <code>DISETUJUI</code>.</li>
          <li>Klik <strong>menu aksi</strong>, lalu pilih <strong>&ldquo;Generate TOR&rdquo;</strong>.</li>
          <li>Sebuah file PDF akan otomatis terunduh, berisi detail proposal dalam format TOR standar.</li>
        </ol>
        
        <hr />
        
        <h2>3. Manajemen Program (Tahap 2 & 3)</h2>
        
        <p>Setelah proposal disetujui, ia akan masuk ke siklus hidup program yang aktif.</p>
        
        <h3>Langkah 1: Konversi Proposal menjadi Program Resmi</h3>
        <ol>
          <li>Cari proposal yang berstatus <code>DISETUJUI</code>.</li>
          <li>Klik <strong>menu aksi</strong>, lalu pilih <strong>&ldquo;Konversi menjadi Program&rdquo;</strong>.</li>
          <li>Anda akan diarahkan ke form finalisasi. Di sini Anda wajib mengisi:
            <ul>
              <li><strong>Anggaran Final</strong> yang dialokasikan.</li>
              <li><strong>Tanggal Mulai & Selesai</strong> yang pasti.</li>
              <li><strong>Penanggung Jawab (User)</strong> yang akan melaksanakan program di lapangan.</li>
            </ul>
          </li>
          <li>Klik <strong>&ldquo;Simpan&rdquo;</strong>. Proposal lama akan berubah status menjadi <code>DIJALANKAN</code>, dan sebuah <strong>Program Resmi</strong> baru akan dibuat dan muncul di menu <strong>&ldquo;Program Berjalan&rdquo;</strong>.</li>
        </ol>
        
        <h3>Langkah 2: Memantau Laporan Progres</h3>
        <ol>
          <li>Klik menu <strong>&ldquo;Program Berjalan&rdquo;</strong> di sidebar.</li>
          <li>Klik judul program untuk masuk ke halaman detailnya.</li>
          <li>Di bagian bawah, Anda akan menemukan <strong>&ldquo;Riwayat Laporan&rdquo;</strong>. Di sinilah semua laporan progres dari User Pelaksana (seperti laporan keuangan, insiden, dll.) akan muncul secara real-time.</li>
        </ol>
        
        <h3>Langkah 3: Mengelola Dokumen Penting</h3>
        <p>Setiap program memiliki repositori dokumennya sendiri.</p>
        <ol>
          <li>Masuk ke halaman <strong>Detail Program</strong>.</li>
          <li>Temukan bagian <strong>&ldquo;Manajemen Dokumen Penting&rdquo;</strong>.</li>
          <li>Gunakan fitur ini untuk mengunggah dan menyimpan file-file formal seperti <strong>MoU, PKS, Surat Resmi, atau foto dokumentasi penting</strong>.</li>
        </ol>
        
        <h3>Langkah 4: Menyelesaikan Program & Generate LPJ</h3>
        <p>Setelah program selesai di lapangan:</p>
        <ol>
          <li>Masuk ke halaman <strong>Detail Program</strong>.</li>
          <li>Klik tombol <strong>&ldquo;Tandai sebagai Selesai&rdquo;</strong>. Status program akan berubah menjadi <code>SELESAI</code>.</li>
          <li>Setelah status berubah, tombol <strong>&ldquo;Generate LPJ (PDF)&rdquo;</strong> akan muncul.</li>
          <li>Klik tombol tersebut untuk mengunduh Laporan Pertanggungjawaban (LPJ) lengkap yang secara otomatis merangkum semua data program dan riwayat laporannya.</li>
        </ol>
        
        <hr />
        
        <h2>4. Fitur Lanjutan</h2>
        
        <h3>Halaman Insights</h3>
        <p>Menu <strong>&ldquo;Insights&rdquo;</strong> adalah pusat analisis data Anda.</p>
        <ul>
          <li><strong>Laporan Template:</strong> Menghasilkan laporan terstruktur secara otomatis, seperti analisis anggaran atau daftar program berisiko.</li>
          <li><strong>AI Insight:</strong> Ajukan pertanyaan dalam bahasa natural (contoh: &ldquo;Berapa total anggaran untuk pilar lingkungan?&rdquo;) dan biarkan AI menganalisis dan menjawabnya untuk Anda.</li>
        </ul>
        
        <h3>Manajemen Akun</h3>
        <ol>
          <li>Klik <strong>nama dan foto profil Anda</strong> di pojok kanan atas header.</li>
          <li>Pilih <strong>&ldquo;Pengaturan Akun&rdquo;</strong>.</li>
          <li>Di halaman ini, Anda dapat mengubah nama, foto profil, email, dan password Anda.</li>
        </ol>
      </div>
    </div>
  );
}