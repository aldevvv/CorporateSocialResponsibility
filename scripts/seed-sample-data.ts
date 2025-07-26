// scripts/seed-sample-data.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating sample proposals and programs...');

  // Get existing users
  const admin = await prisma.user.findUnique({ where: { email: 'admin@pln.co.id' } });
  const budi = await prisma.user.findUnique({ where: { email: 'budi.santoso@pln.co.id' } });
  const siti = await prisma.user.findUnique({ where: { email: 'siti.rahayu@pln.co.id' } });
  const ahmad = await prisma.user.findUnique({ where: { email: 'ahmad.wijaya@pln.co.id' } });

  if (!admin || !budi || !siti || !ahmad) {
    console.error('Users not found. Please run the main seed first.');
    return;
  }

  // Create sample proposals
  const proposal1 = await prisma.programProposal.create({
    data: {
      judul: 'Program Beasiswa Anak Prasejahtera',
      pilar: 'PENDIDIKAN',
      lokasiKabupaten: 'Jakarta Selatan',
      lokasiKecamatan: 'Kebayoran Baru',
      lokasiDesa: 'Senayan',
      latarBelakang: 'Banyak anak-anak di wilayah Senayan yang tidak dapat melanjutkan pendidikan karena keterbatasan ekonomi keluarga.',
      tujuanProgram: 'Memberikan bantuan beasiswa kepada 50 anak prasejahtera untuk melanjutkan pendidikan hingga SMA.',
      indikatorKeberhasilan: '1. 50 anak mendapat beasiswa\n2. 90% anak lulus tepat waktu\n3. Peningkatan prestasi akademik',
      targetPenerimaManfaat: 'Anak-anak prasejahtera usia 7-18 tahun',
      jumlahPenerimaManfaat: 50,
      estimasiAnggaran: 250000000,
      perkiraanMulai: new Date('2024-02-01'),
      perkiraanSelesai: new Date('2024-12-31'),
      status: 'DISETUJUI',
      createdById: admin.id,
    },
  });

  const proposal2 = await prisma.programProposal.create({
    data: {
      judul: 'Pelatihan Kewirausahaan UMKM',
      pilar: 'PENGEMBANGAN_UMK',
      lokasiKabupaten: 'Bandung',
      lokasiKecamatan: 'Cibiru',
      lokasiDesa: 'Cibiru Wetan',
      latarBelakang: 'UMKM di wilayah Cibiru membutuhkan peningkatan kapasitas dalam manajemen usaha dan pemasaran digital.',
      tujuanProgram: 'Meningkatkan kapasitas 30 pelaku UMKM melalui pelatihan kewirausahaan dan pendampingan usaha.',
      indikatorKeberhasilan: '1. 30 UMKM mengikuti pelatihan\n2. 80% peserta menerapkan ilmu yang didapat\n3. Peningkatan omzet rata-rata 25%',
      targetPenerimaManfaat: 'Pelaku UMKM di wilayah Cibiru',
      jumlahPenerimaManfaat: 30,
      estimasiAnggaran: 150000000,
      perkiraanMulai: new Date('2024-03-01'),
      perkiraanSelesai: new Date('2024-08-31'),
      status: 'DISETUJUI',
      createdById: admin.id,
    },
  });

  const proposal3 = await prisma.programProposal.create({
    data: {
      judul: 'Penghijauan Kawasan Industri',
      pilar: 'LINGKUNGAN',
      lokasiKabupaten: 'Bekasi',
      lokasiKecamatan: 'Cikarang Utara',
      lokasiDesa: 'Karang Asih',
      latarBelakang: 'Kawasan industri Cikarang membutuhkan program penghijauan untuk mengurangi polusi udara.',
      tujuanProgram: 'Menanam 1000 pohon dan membuat taman hijau seluas 2 hektar di kawasan industri.',
      indikatorKeberhasilan: '1. 1000 pohon tertanam\n2. Taman hijau 2 hektar selesai\n3. Kualitas udara membaik',
      targetPenerimaManfaat: 'Masyarakat sekitar kawasan industri',
      jumlahPenerimaManfaat: 500,
      estimasiAnggaran: 300000000,
      perkiraanMulai: new Date('2024-01-15'),
      perkiraanSelesai: new Date('2024-06-30'),
      status: 'DIAJUKAN',
      createdById: admin.id,
    },
  });

  // Create programs from approved proposals
  const program1 = await prisma.program.create({
    data: {
      judul: proposal1.judul,
      pilar: proposal1.pilar,
      lokasiKabupaten: proposal1.lokasiKabupaten,
      lokasiKecamatan: proposal1.lokasiKecamatan,
      latarBelakang: proposal1.latarBelakang,
      tujuanProgram: proposal1.tujuanProgram,
      indikatorKeberhasilan: proposal1.indikatorKeberhasilan,
      targetPenerimaManfaat: proposal1.targetPenerimaManfaat,
      jumlahPenerimaManfaat: proposal1.jumlahPenerimaManfaat,
      anggaranFinal: 240000000, // Slightly adjusted from proposal
      tanggalMulaiFinal: new Date('2024-02-01'),
      tanggalSelesaiFinal: new Date('2024-12-31'),
      penanggungJawabId: budi.id,
      proposalAsalId: proposal1.id,
      status: 'BERJALAN',
    },
  });

  const program2 = await prisma.program.create({
    data: {
      judul: proposal2.judul,
      pilar: proposal2.pilar,
      lokasiKabupaten: proposal2.lokasiKabupaten,
      lokasiKecamatan: proposal2.lokasiKecamatan,
      latarBelakang: proposal2.latarBelakang,
      tujuanProgram: proposal2.tujuanProgram,
      indikatorKeberhasilan: proposal2.indikatorKeberhasilan,
      targetPenerimaManfaat: proposal2.targetPenerimaManfaat,
      jumlahPenerimaManfaat: proposal2.jumlahPenerimaManfaat,
      anggaranFinal: 145000000,
      tanggalMulaiFinal: new Date('2024-03-01'),
      tanggalSelesaiFinal: new Date('2024-08-31'),
      penanggungJawabId: siti.id,
      proposalAsalId: proposal2.id,
      status: 'BERJALAN',
    },
  });

  // Update proposal status to DIJALANKAN
  await prisma.programProposal.updateMany({
    where: { id: { in: [proposal1.id, proposal2.id] } },
    data: { status: 'DIJALANKAN' },
  });

  // Create sample reports
  await prisma.laporanProgres.create({
    data: {
      tipeLaporan: 'PROGRES_RUTIN',
      data: {
        periode: 'Minggu ke-1 Februari 2024',
        aktivitas: 'Melakukan sosialisasi program beasiswa kepada masyarakat dan sekolah-sekolah di wilayah Senayan',
        progres: 'Telah melakukan sosialisasi ke 5 sekolah dan berhasil mengidentifikasi 75 calon penerima beasiswa',
        kendala: 'Beberapa orang tua masih ragu dengan program ini',
        rencanaSelanjutnya: 'Melakukan verifikasi data calon penerima dan proses seleksi',
      },
      programId: program1.id,
      createdById: budi.id,
    },
  });

  await prisma.laporanProgres.create({
    data: {
      tipeLaporan: 'KEUANGAN',
      data: {
        periode: 'Februari 2024',
        anggaranTerpakai: '15000000',
        sisaAnggaran: '225000000',
        rincianPengeluaran: 'Biaya sosialisasi: Rp 10.000.000\nBiaya administrasi: Rp 3.000.000\nBiaya transportasi: Rp 2.000.000',
      },
      programId: program1.id,
      createdById: budi.id,
    },
  });

  await prisma.laporanProgres.create({
    data: {
      tipeLaporan: 'PROGRES_RUTIN',
      data: {
        periode: 'Minggu ke-1 Maret 2024',
        aktivitas: 'Persiapan materi pelatihan kewirausahaan dan koordinasi dengan narasumber',
        progres: 'Materi pelatihan 80% selesai, telah mengkonfirmasi 3 narasumber ahli',
        kendala: 'Kesulitan mencari tempat pelatihan yang sesuai kapasitas',
        rencanaSelanjutnya: 'Finalisasi tempat pelatihan dan mulai pendaftaran peserta',
      },
      programId: program2.id,
      createdById: siti.id,
    },
  });

  await prisma.laporanProgres.create({
    data: {
      tipeLaporan: 'PENCAPAIAN_MILESTONE',
      data: {
        milestone: 'Penyelesaian Materi Pelatihan',
        tanggalCapai: '2024-03-15',
        deskripsi: 'Berhasil menyelesaikan seluruh materi pelatihan kewirausahaan meliputi: manajemen keuangan, pemasaran digital, dan strategi bisnis',
        bukti: 'Dokumen materi pelatihan telah direview dan disetujui oleh supervisor',
      },
      programId: program2.id,
      createdById: siti.id,
    },
  });

  console.log('Sample data created successfully!');
  console.log(`Created ${await prisma.programProposal.count()} proposals`);
  console.log(`Created ${await prisma.program.count()} programs`);
  console.log(`Created ${await prisma.laporanProgres.count()} reports`);
  
  console.log('\nProgram assignments:');
  console.log(`- Budi Santoso: ${program1.judul}`);
  console.log(`- Siti Rahayu: ${program2.judul}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });