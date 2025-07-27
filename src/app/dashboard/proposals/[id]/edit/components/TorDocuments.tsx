// app/dashboard/proposals/components/TorDocument.tsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { ProgramProposal } from '@prisma/client';
import path from 'path';
import fs from 'fs';

// Daftarkan font (opsional, tapi disarankan untuk tampilan profesional)
// Pastikan Anda sudah menempatkan file font di folder public
// Font.register({
//   family: 'Times-Roman',
//   src: '/path/to/times-new-roman.ttf',
// });

// Definisikan gaya untuk dokumen resmi PLN
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Times-Roman',
    fontSize: 12,
    lineHeight: 1.4,
  },
  // Kop Surat PLN dengan Logo
  letterhead: {
    marginBottom: 25,
    borderBottom: '2px solid #000000',
    paddingBottom: 15,
  },
  letterheadContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    objectFit: 'contain',
  },
  companyInfo: {
    width: '70%',
    paddingLeft: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
    marginBottom: 5,
  },
  companySubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
    marginBottom: 3,
  },
  companyAddress: {
    fontSize: 10,
    textAlign: 'center',
    color: '#333',
    marginBottom: 2,
  },
  // Header dokumen
  documentHeader: {
    marginTop: 15,
    marginBottom: 20,
    textAlign: 'center',
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textDecoration: 'underline',
    marginBottom: 8,
  },
  documentSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  // Konten
  section: {
    marginBottom: 12,
    pageBreakInside: false,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 11,
    lineHeight: 1.4,
    textAlign: 'justify',
    marginBottom: 4,
  },
  table: {
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 2,
    pageBreakInside: false,
  },
  tableLabel: {
    fontSize: 11,
    width: '28%',
    fontWeight: 'bold',
  },
  tableColon: {
    fontSize: 11,
    width: '3%',
  },
  tableValue: {
    fontSize: 11,
    width: '69%',
    textAlign: 'justify',
  },
  // Footer
  footer: {
    marginTop: 25,
    paddingTop: 12,
    borderTop: '1px solid #ccc',
  },
  signature: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    pageBreakInside: false,
  },
  signatureBox: {
    width: '45%',
    textAlign: 'center',
  },
  signatureTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  signatureName: {
    fontSize: 11,
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  signaturePosition: {
    fontSize: 10,
    marginTop: 2,
  },
});

interface TorDocumentProps {
  proposal: ProgramProposal & {
    createdBy: {
      name: string | null;
      email: string;
    };
  };
}

// Helper functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Helper function to get PLN logo as base64
const getPLNLogoBase64 = () => {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'PLN.png');
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    return logoBase64;
  } catch (error) {
    console.error('Error loading PLN logo:', error);
    return null;
  }
};

// Komponen Dokumen PDF dengan format resmi PLN
export function TorDocument({ proposal }: TorDocumentProps) {
  const logoBase64 = getPLNLogoBase64();
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* KOP SURAT PLN DENGAN LOGO */}
        <View style={styles.letterhead}>
          <View style={styles.letterheadContent}>
            <View style={styles.logoContainer}>
              {logoBase64 ? (
                <Image
                  style={styles.logo}
                  src={logoBase64}
                  alt="PLN Logo"
                />
              ) : (
                <View style={[styles.logo, { backgroundColor: '#1E40AF', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }]}>
                  <Text style={{ color: 'white', fontSize: 8, fontWeight: 'bold' }}>PLN</Text>
                </View>
              )}
            </View>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>PT PLN (PERSERO)</Text>
              <Text style={styles.companySubtitle}>UNIT INDUK PEMBANGUNAN KOTA MAKASSAR</Text>
              <Text style={styles.companyAddress}>
                Jl. A.P. Pettarani No. 2, Makassar 90222, Sulawesi Selatan
              </Text>
              <Text style={styles.companyAddress}>
                Telp: (0411) 452233, Fax: (0411) 452244
              </Text>
              <Text style={styles.companyAddress}>
                Email: uip.makassar@pln.co.id | Website: www.pln.co.id
              </Text>
            </View>
          </View>
        </View>

        {/* HEADER DOKUMEN */}
        <View style={styles.documentHeader}>
          <Text style={styles.documentTitle}>TERMS OF REFERENCE (TOR)</Text>
          <Text style={styles.documentSubtitle}>PROGRAM TANGGUNG JAWAB SOSIAL DAN LINGKUNGAN</Text>
          <Text style={styles.documentSubtitle}>&ldquo;{proposal.judul}&rdquo;</Text>
        </View>

        {/* INFORMASI DASAR */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Nama Program</Text>
            <Text style={styles.tableColon}>:</Text>
            <Text style={styles.tableValue}>{proposal.judul}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Pilar TJSL</Text>
            <Text style={styles.tableColon}>:</Text>
            <Text style={styles.tableValue}>{proposal.pilar?.toString().replace(/_/g, ' ') || 'Tidak tersedia'}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Lokasi</Text>
            <Text style={styles.tableColon}>:</Text>
            <Text style={styles.tableValue}>
              Kab/Kota: {proposal.lokasiKabupaten || 'Tidak tersedia'},
              Kecamatan: {proposal.lokasiKecamatan || 'Tidak tersedia'}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Status</Text>
            <Text style={styles.tableColon}>:</Text>
            <Text style={styles.tableValue}>{proposal.status}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Tanggal Dibuat</Text>
            <Text style={styles.tableColon}>:</Text>
            <Text style={styles.tableValue}>{formatDate(proposal.createdAt)}</Text>
          </View>
        </View>

        {/* KONTEN UTAMA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I. LATAR BELAKANG</Text>
          <Text style={styles.text}>{proposal.latarBelakang}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>II. TUJUAN PROGRAM</Text>
          <Text style={styles.text}>{proposal.tujuanProgram}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>III. TARGET DAN PENERIMA MANFAAT</Text>
          <Text style={styles.text}>
            Target Penerima Manfaat: {proposal.targetPenerimaManfaat || 'Tidak tersedia'}{'\n'}
            Jumlah Penerima Manfaat: {proposal.jumlahPenerimaManfaat || 'Tidak tersedia'} Orang/KK
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>IV. INDIKATOR KEBERHASILAN</Text>
          <Text style={styles.text}>{proposal.indikatorKeberhasilan || 'Tidak tersedia'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>V. ANGGARAN DAN JADWAL PELAKSANAAN</Text>
          <Text style={styles.text}>
            Estimasi Anggaran: {proposal.estimasiAnggaran ? formatCurrency(Number(proposal.estimasiAnggaran)) : 'Tidak tersedia'}{'\n'}
            Perkiraan Tanggal Mulai: {proposal.perkiraanMulai ? formatDate(proposal.perkiraanMulai) : 'Tidak tersedia'}{'\n'}
            Perkiraan Tanggal Selesai: {proposal.perkiraanSelesai ? formatDate(proposal.perkiraanSelesai) : 'Tidak tersedia'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VI. PENANGGUNG JAWAB</Text>
          <Text style={styles.text}>
            Nama: {proposal.createdBy.name || 'Tidak tersedia'}{'\n'}
            Email: {proposal.createdBy.email}{'\n'}
            Jabatan: Penanggung Jawab Program CSR
          </Text>
        </View>

        {/* TANDA TANGAN */}
        <View style={styles.signature}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureTitle}>Disetujui oleh,</Text>
            <Text style={styles.signatureName}>Manager UIP Makassar</Text>
            <Text style={styles.signaturePosition}>PT PLN (Persero)</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureTitle}>Dibuat oleh,</Text>
            <Text style={styles.signatureName}>{proposal.createdBy.name || 'Tidak tersedia'}</Text>
            <Text style={styles.signaturePosition}>Penanggung Jawab Program</Text>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={[styles.text, { textAlign: 'center', fontSize: 9, color: '#666' }]}>
            Dokumen ini dibuat secara otomatis oleh Sistem Monitoring CSR PLN UIP Kota Makassar{'\n'}
            Tanggal Generate: {formatDate(new Date())} | Ref: TOR-{proposal.id.substring(0, 8).toUpperCase()}
          </Text>
        </View>
      </Page>
    </Document>
  );
}