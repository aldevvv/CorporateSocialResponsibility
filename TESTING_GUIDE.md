# 🧪 Panduan Testing TJSL Platform

## 👥 Akun Testing

Berikut adalah akun yang telah dibuat untuk testing:

### 🔑 Login Credentials

| Role | Email | Password | Nama |
|------|-------|----------|------|
| **ADMIN** | admin@pln.co.id | password123 | Admin TJSL |
| **USER** | budi.santoso@pln.co.id | password123 | Budi Santoso |
| **USER** | siti.rahayu@pln.co.id | password123 | Siti Rahayu |
| **USER** | ahmad.wijaya@pln.co.id | password123 | Ahmad Wijaya |
| **USER** | dewi.kartika@pln.co.id | password123 | Dewi Kartika |

## 📋 Data Sample yang Tersedia

### Proposals
1. **Program Beasiswa Anak Prasejahtera** (Status: DIJALANKAN)
   - Pilar: Pendidikan
   - Lokasi: Jakarta Selatan, Kebayoran Baru
   - Anggaran: Rp 250.000.000
   - Penanggung Jawab: Budi Santoso

2. **Pelatihan Kewirausahaan UMKM** (Status: DIJALANKAN)
   - Pilar: Pengembangan UMK
   - Lokasi: Bandung, Cibiru
   - Anggaran: Rp 150.000.000
   - Penanggung Jawab: Siti Rahayu

3. **Penghijauan Kawasan Industri** (Status: DIAJUKAN)
   - Pilar: Lingkungan
   - Lokasi: Bekasi, Cikarang Utara
   - Anggaran: Rp 300.000.000

### Laporan Progress
- **Budi Santoso** memiliki 2 laporan (Progres Rutin & Keuangan)
- **Siti Rahayu** memiliki 2 laporan (Progres Rutin & Pencapaian Milestone)

## 🧪 Skenario Testing

### 1. Testing Role ADMIN

**Login:** admin@pln.co.id / password123

**Fitur yang bisa ditest:**
- ✅ Dashboard redirect ke `/dashboard/proposals`
- ✅ Melihat semua proposal dalam tabel
- ✅ Mengsetujui/menolak proposal yang berstatus DIAJUKAN
- ✅ Mengkonversi proposal DISETUJUI menjadi program
- ✅ Melihat semua program di `/dashboard/programs`
- ✅ Melihat detail program dan semua laporan
- ✅ Sidebar menampilkan: Dashboard, Manajemen Proposal, Program Berjalan

**Test Flow Admin:**
1. Login sebagai admin
2. Lihat daftar proposal → Setujui "Penghijauan Kawasan Industri"
3. Konversi proposal yang disetujui menjadi program
4. Assign penanggung jawab (pilih Ahmad atau Dewi)
5. Lihat daftar program berjalan
6. Buka detail program → lihat laporan yang sudah ada

### 2. Testing Role USER - Budi Santoso

**Login:** budi.santoso@pln.co.id / password123

**Fitur yang bisa ditest:**
- ✅ Dashboard redirect ke `/dashboard/my-programs`
- ✅ Hanya melihat program yang ditugaskan (Program Beasiswa)
- ✅ Buka detail program yang ditugaskan
- ✅ Membuat laporan progres (5 jenis laporan tersedia)
- ✅ Melihat riwayat laporan yang sudah dibuat
- ✅ Sidebar menampilkan: Dashboard, Program Saya

**Test Flow User:**
1. Login sebagai Budi
2. Lihat "Program Saya" → hanya ada 1 program
3. Klik detail program "Program Beasiswa Anak Prasejahtera"
4. Lihat laporan yang sudah ada (2 laporan)
5. Buat laporan baru:
   - Pilih jenis "Kegiatan Khusus"
   - Isi form dengan data kegiatan
   - Submit laporan
6. Refresh halaman → lihat laporan baru muncul

### 3. Testing Role USER - Siti Rahayu

**Login:** siti.rahayu@pln.co.id / password123

**Test yang sama seperti Budi, tapi untuk program "Pelatihan Kewirausahaan UMKM"**

### 4. Testing Role USER - Ahmad/Dewi

**Login:** ahmad.wijaya@pln.co.id / password123 atau dewi.kartika@pln.co.id / password123

**Fitur yang bisa ditest:**
- ✅ Dashboard redirect ke `/dashboard/my-programs`
- ✅ Halaman kosong (belum ada program yang ditugaskan)
- ✅ Setelah admin assign program baru → akan muncul di sini

## 🎯 Fitur Utama untuk Ditest

### A. Role-Based Access Control
- [x] Admin dapat mengakses semua fitur
- [x] User hanya dapat mengakses program yang ditugaskan
- [x] Sidebar berbeda berdasarkan role
- [x] Redirect otomatis berdasarkan role

### B. Proposal Management (Admin)
- [x] Lihat daftar proposal dengan status
- [x] Setujui/tolak proposal
- [x] Konversi proposal menjadi program
- [x] Assign penanggung jawab

### C. Program Management
- [x] Admin: lihat semua program
- [x] User: lihat program yang ditugaskan
- [x] Detail program dengan informasi lengkap
- [x] Breadcrumb navigation

### D. Progress Reporting (User)
- [x] Form dinamis berdasarkan jenis laporan:
  - Progres Rutin
  - Pencapaian Milestone
  - Laporan Keuangan
  - Insiden/Kendala
  - Kegiatan Khusus
- [x] Validasi form dengan error handling
- [x] Tampilan riwayat laporan
- [x] Format tampilan sesuai jenis laporan

### E. UI/UX
- [x] Responsive design
- [x] Consistent styling dengan shadcn/ui
- [x] Loading states
- [x] Error handling
- [x] Success feedback

## 🚀 Quick Start Testing

1. **Start aplikasi:**
   ```bash
   npm run dev
   ```

2. **Akses:** http://localhost:3000

3. **Login sebagai Admin** dan test workflow lengkap

4. **Login sebagai User** dan test fitur pelaporan

5. **Test role switching** untuk memastikan access control bekerja

## 🐛 Hal yang Perlu Diperhatikan

- Pastikan database sudah di-seed dengan data testing
- Logout sepenuhnya sebelum ganti role
- Refresh browser jika ada masalah session
- Periksa console untuk error JavaScript
- Test di berbagai ukuran layar untuk responsiveness

## 📊 Expected Results

Setelah testing, Anda harus bisa:
- Login dengan berbagai role
- Melihat interface yang berbeda per role
- Membuat dan mengkonversi proposal
- Assign program ke user
- Membuat laporan progres
- Melihat riwayat laporan
- Navigasi yang smooth dengan breadcrumbs