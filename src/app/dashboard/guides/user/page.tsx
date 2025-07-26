// app/dashboard/guides/user/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Users, BookOpen } from 'lucide-react';

export default function UserGuidePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      router.push('/login');
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

  // Redirect to login if not authenticated
  if (!session) {
    return null; // Will redirect via useEffect
  }

  // Show user guide content (available to all authenticated users)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-[#1E40AF]" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panduan Pengguna</h1>
          <p className="text-gray-600">Panduan lengkap untuk menggunakan sistem PLN UIP Kota Makassar</p>
        </div>
      </div>

      {/* Guide Content */}
      <div className="prose prose-lg max-w-none">
        <h1>Panduan Lengkap untuk User (Pelaksana Program)</h1>
        
        <p>Selamat datang di panduan untuk User Pelaksana program TJSL. Peran Anda sangat penting untuk melaporkan perkembangan dan realisasi program langsung dari lapangan.</p>
        
        <p>Dokumen ini akan memandu Anda melalui semua fitur yang Anda butuhkan untuk menjalankan tugas pelaporan.</p>
        
        <hr />
        
        <h2>1. Mengenal Halaman Utama Anda</h2>
        
        <p>Setelah Anda login, Anda akan langsung diarahkan ke halaman <strong>"Program yang Saya Tangani"</strong>. Halaman ini adalah pusat kerja Anda.</p>
        
        <ul>
          <li><strong>Daftar Program:</strong> Anda akan melihat sebuah tabel yang berisi semua program yang secara resmi menjadi tanggung jawab Anda.</li>
          <li><strong>Akses Detail:</strong> Untuk mulai melaporkan atau melihat detail, cukup klik <strong>judul program</strong> yang ingin Anda kerjakan.</li>
        </ul>
        
        <hr />
        
        <h2>2. Proses Pelaporan Progres</h2>
        
        <p>Ini adalah tugas utama Anda di dalam sistem. Melaporkan progres secara rutin dan akurat akan sangat membantu Admin dalam memantau kesehatan program.</p>
        
        <h3>Langkah 1: Mengakses Halaman Detail Program</h3>
        <p>Klik judul program pada halaman utama Anda. Anda akan dibawa ke halaman detail yang berisi semua informasi tentang program tersebut dan area untuk pelaporan.</p>
        
        <h3>Langkah 2: Membuat Laporan Baru</h3>
        <ol>
          <li>Di halaman detail program, cari bagian <strong>"Buat Laporan Baru"</strong>.</li>
          <li>Langkah pertama adalah <strong>memilih jenis laporan</strong> dari menu dropdown yang tersedia.</li>
          <li>Setelah Anda memilih jenis laporan, formulir yang sesuai akan muncul di bawahnya.</li>
        </ol>
        
        <h3>Langkah 3: Memahami Setiap Jenis Laporan</h3>
        
        <p>Penting untuk menggunakan jenis laporan yang tepat sesuai dengan aktivitas Anda.</p>
        
        <ul>
          <li><strong>PROGRES RUTIN</strong>
            <ul>
              <li><strong>Kapan digunakan:</strong> Untuk laporan berkala (misalnya mingguan atau bulanan) mengenai kemajuan umum program.</li>
              <li><strong>Isi:</strong> Jelaskan kegiatan yang sudah dilakukan dan isi perkiraan progres dalam bentuk persentase (%).</li>
            </ul>
          </li>
          
          <li><strong>KEUANGAN</strong>
            <ul>
              <li><strong>Kapan digunakan:</strong> <strong>Setiap kali</strong> ada transaksi keuangan, baik itu pemasukan dana maupun pengeluaran.</li>
              <li><strong>Isi:</strong> Jelaskan transaksi, masukkan jumlahnya, pilih tipe (<code>pemasukan</code> atau <code>pengeluaran</code>), dan yang terpenting, <strong>unggah bukti</strong> (foto nota, kuitansi, atau bukti transfer).</li>
            </ul>
          </li>
          
          <li><strong>PENCAPAIAN MILESTONE</strong>
            <ul>
              <li><strong>Kapan digunakan:</strong> Ketika sebuah target atau capaian penting dalam program berhasil diraih. Contoh: "Pembangunan fondasi selesai", "Penyerahan bantuan tahap 1", "Peserta pelatihan lulus".</li>
              <li><strong>Isi:</strong> Jelaskan milestone yang tercapai dan jumlah penerima manfaat baru (jika ada).</li>
            </ul>
          </li>
          
          <li><strong>INSIDEN / KENDALA</strong>
            <ul>
              <li><strong>Kapan digunakan:</strong> Jika terjadi masalah, hambatan, atau insiden tak terduga di lapangan.</li>
              <li><strong>Isi:</strong> Jelaskan kendala yang dihadapi dan pilih tingkat urgensinya. Laporan ini sangat penting agar Admin bisa segera membantu.</li>
            </ul>
          </li>
          
          <li><strong>KEGIATAN KHUSUS</strong>
            <ul>
              <li><strong>Kapan digunakan:</strong> Untuk melaporkan acara atau kegiatan spesifik di luar rutinitas. Contoh: seremoni peresmian, pelatihan khusus, sosialisasi kepada warga.</li>
              <li><strong>Isi:</strong> Jelaskan nama acara, jumlah peserta yang hadir, dan rangkuman hasilnya.</li>
            </ul>
          </li>
        </ul>
        
        <h3>Langkah 4: Melihat Riwayat Laporan Anda</h3>
        <p>Setiap laporan yang berhasil Anda kirim akan langsung muncul di bagian <strong>"Riwayat Laporan"</strong> di halaman yang sama. Anda bisa meninjau kembali semua laporan yang pernah Anda buat di sini.</p>
        
        <hr />
        
        <h2>3. Manajemen Akun</h2>
        
        <p>Anda bisa mengelola data pribadi Anda.</p>
        <ol>
          <li>Klik <strong>nama dan foto profil Anda</strong> di pojok kanan atas header.</li>
          <li>Pilih <strong>"Pengaturan Akun"</strong>.</li>
          <li>Di halaman ini, Anda dapat mengubah <strong>nama, foto profil, email, dan password</strong> Anda. Pastikan untuk memasukkan password saat ini jika Anda ingin mengubah email atau password.</li>
        </ol>
      </div>
    </div>
  );
}