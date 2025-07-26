// app/dashboard/programs/components/LpjDocument.tsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Program, LaporanProgres, User } from '@prisma/client';

type ProgramWithDetails = Program & {
  penanggungJawab: User;
  laporanProgres: (LaporanProgres & { createdBy: User })[];
};

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  header: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    lineHeight: 1.5,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 10,
  },
});

// Helper untuk merender detail laporan berdasarkan tipenya
const renderReportDetail = (report: LaporanProgres) => {
  const data: any = report.data;
  switch (report.tipeLaporan) {
    case 'PROGRES_RUTIN':
      return (
        <Text style={styles.text}>
          - [Progres] {data.deskripsiKegiatan} ({data.persentaseProgres}%)
        </Text>
      );
    case 'KEUANGAN':
      return (
        <Text style={styles.text}>
          - [Keuangan] {data.deskripsiTransaksi}: Rp {Number(data.jumlah).toLocaleString('id-ID')} ({data.tipe})
        </Text>
      );
    case 'MASALAH_KENDALA':
      return (
        <Text style={styles.text}>
          - [Masalah] {data.deskripsiMasalah} | Solusi: {data.solusiDiterapkan}
        </Text>
      );
    case 'DAMPAK_MANFAAT':
      return (
        <Text style={styles.text}>
          - [Dampak] {data.deskripsiDampak} | Penerima: {data.jumlahPenerima} orang
        </Text>
      );
    case 'DOKUMENTASI':
      return (
        <Text style={styles.text}>
          - [Dokumentasi] {data.deskripsiKegiatan} | Lokasi: {data.lokasiKegiatan}
        </Text>
      );
    default:
      return null;
  }
};

export function LpjDocument({ program }: { program: ProgramWithDetails }) {
  // Agregasi data: Menghitung total pengeluaran dan pemasukan
  const laporanKeuangan = program.laporanProgres.filter(r => r.tipeLaporan === 'KEUANGAN');
  const totalPengeluaran = laporanKeuangan
    .filter(r => (r.data as any).tipe === 'pengeluaran')
    .reduce((sum, r) => sum + Number((r.data as any).jumlah), 0);
  const totalPemasukan = laporanKeuangan
    .filter(r => (r.data as any).tipe === 'pemasukan')
    .reduce((sum, r) => sum + Number((r.data as any).jumlah), 0);

  // Menghitung rata-rata progres
  const laporanProgres = program.laporanProgres.filter(r => r.tipeLaporan === 'PROGRES_RUTIN');
  const rataRataProgres = laporanProgres.length > 0 
    ? laporanProgres.reduce((sum, r) => sum + Number((r.data as any).persentaseProgres), 0) / laporanProgres.length 
    : 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>LAPORAN PERTANGGUNGJAWABAN (LPJ)</Text>
        <Text style={styles.header}>{program.judul}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I. INFORMASI PROGRAM</Text>
          <Text style={styles.text}>Pilar TJSL: {program.pilar.replace(/_/g, ' ')}</Text>
          <Text style={styles.text}>Lokasi: {program.lokasiKecamatan}, {program.lokasiKabupaten}</Text>
          <Text style={styles.text}>Penanggung Jawab: {program.penanggungJawab.name}</Text>
          <Text style={styles.text}>
            Periode: {new Date(program.tanggalMulaiFinal).toLocaleDateString('id-ID')} - {new Date(program.tanggalSelesaiFinal).toLocaleDateString('id-ID')}
          </Text>
          <Text style={styles.text}>Status: {program.status}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>II. TUJUAN DAN TARGET</Text>
          <Text style={styles.text}>Tujuan Program: {program.tujuanProgram}</Text>
          <Text style={styles.text}>Target Penerima Manfaat: {program.targetPenerimaManfaat}</Text>
          <Text style={styles.text}>Jumlah Penerima Manfaat: {program.jumlahPenerimaManfaat} Orang/KK</Text>
          <Text style={styles.text}>Indikator Keberhasilan: {program.indikatorKeberhasilan}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>III. RANGKUMAN ANGGARAN</Text>
          <Text style={styles.text}>Anggaran Final: Rp {Number(program.anggaranFinal).toLocaleString('id-ID')}</Text>
          <Text style={styles.text}>Total Pemasukan Dilaporkan: Rp {totalPemasukan.toLocaleString('id-ID')}</Text>
          <Text style={styles.text}>Total Pengeluaran Dilaporkan: Rp {totalPengeluaran.toLocaleString('id-ID')}</Text>
          <Text style={styles.text}>Sisa Anggaran: Rp {(Number(program.anggaranFinal) - totalPengeluaran).toLocaleString('id-ID')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>IV. RINGKASAN PROGRES</Text>
          <Text style={styles.text}>Total Laporan Progres: {laporanProgres.length} laporan</Text>
          <Text style={styles.text}>Rata-rata Progres: {rataRataProgres.toFixed(1)}%</Text>
          <Text style={styles.text}>Total Laporan Keuangan: {laporanKeuangan.length} transaksi</Text>
          <Text style={styles.text}>Total Laporan Masalah: {program.laporanProgres.filter(r => r.tipeLaporan === 'MASALAH_KENDALA').length} laporan</Text>
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>V. RIWAYAT LAPORAN PROGRES</Text>
          {program.laporanProgres.length === 0 ? (
            <Text style={styles.text}>Belum ada laporan progres yang disubmit.</Text>
          ) : (
            program.laporanProgres.map((report, index) => (
              <View key={report.id} style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 10, color: 'grey', marginBottom: 2 }}>
                  {new Date(report.createdAt).toLocaleString('id-ID')} - {report.createdBy.name}
                </Text>
                {renderReportDetail(report)}
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VI. KESIMPULAN</Text>
          <Text style={styles.text}>
            Program "{program.judul}" telah {program.status === 'SELESAI' ? 'selesai dilaksanakan' : 'berjalan'} 
            dengan total anggaran Rp {Number(program.anggaranFinal).toLocaleString('id-ID')} 
            dan telah menghasilkan {program.laporanProgres.length} laporan progres.
          </Text>
          {program.status === 'SELESAI' && (
            <Text style={styles.text}>
              Program ini telah mencapai target penerima manfaat sebanyak {program.jumlahPenerimaManfaat} 
              orang/KK sesuai dengan indikator keberhasilan yang ditetapkan.
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: 10, textAlign: 'center', marginTop: 30 }}>
            Dokumen ini dibuat secara otomatis oleh Sistem TJSL PLN
          </Text>
          <Text style={{ fontSize: 10, textAlign: 'center' }}>
            Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}
          </Text>
        </View>
      </Page>
    </Document>
  );
}