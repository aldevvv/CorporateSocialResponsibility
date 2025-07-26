'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface LaporanProgres {
  id: string;
  tipeLaporan: string;
  data: any;
  createdAt: string;
  createdBy: {
    name: string;
    email: string;
  };
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface LaporanListProps {
  programId: string;
  initialReports?: LaporanProgres[];
  initialPagination?: PaginationInfo;
}

export function LaporanList({ programId, initialReports = [], initialPagination }: LaporanListProps) {
  const [reports, setReports] = useState<LaporanProgres[]>(initialReports);
  const [pagination, setPagination] = useState<PaginationInfo>(
    initialPagination || {
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      limit: 10,
      hasNext: false,
      hasPrev: false,
    }
  );
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const fetchReports = async (page: number = 1, search: string = '', type: string = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });

      if (search) params.append('search', search);
      if (type && type !== 'all') params.append('type', type);

      const response = await fetch(`/api/programs/${programId}/reports?${params}`);
      const data = await response.json();

      if (response.ok) {
        setReports(data.reports);
        setPagination(data.pagination);
      } else {
        console.error('Error fetching reports:', data.error);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchReports(1, searchTerm, filterType);
  };

  const handlePageChange = (page: number) => {
    fetchReports(page, searchTerm, filterType);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'PROGRES_RUTIN':
        return 'Progres Rutin';
      case 'PENCAPAIAN_MILESTONE':
        return 'Pencapaian Milestone';
      case 'KEUANGAN':
        return 'Laporan Keuangan';
      case 'INSIDEN_KENDALA':
        return 'Insiden/Kendala';
      case 'KEGIATAN_KHUSUS':
        return 'Kegiatan Khusus';
      default:
        return type;
    }
  };

  const getReportTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'PROGRES_RUTIN':
        return 'default';
      case 'PENCAPAIAN_MILESTONE':
        return 'default';
      case 'KEUANGAN':
        return 'secondary';
      case 'INSIDEN_KENDALA':
        return 'destructive';
      case 'KEGIATAN_KHUSUS':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const renderReportContent = (type: string, data: any) => {
    switch (type) {
      case 'PROGRES_RUTIN':
        return (
          <div className="space-y-2 text-sm">
            <p><strong>Periode:</strong> {data.periode}</p>
            <p><strong>Aktivitas:</strong> {data.aktivitas}</p>
            <p><strong>Progres:</strong> {data.progres}</p>
            {data.kendala && <p><strong>Kendala:</strong> {data.kendala}</p>}
            <p><strong>Rencana Selanjutnya:</strong> {data.rencanaSelanjutnya}</p>
          </div>
        );

      case 'PENCAPAIAN_MILESTONE':
        return (
          <div className="space-y-2 text-sm">
            <p><strong>Milestone:</strong> {data.milestone}</p>
            <p><strong>Tanggal Pencapaian:</strong> {new Date(data.tanggalCapai).toLocaleDateString('id-ID')}</p>
            <p><strong>Deskripsi:</strong> {data.deskripsi}</p>
            {data.bukti && <p><strong>Bukti:</strong> {data.bukti}</p>}
          </div>
        );

      case 'KEUANGAN':
        return (
          <div className="space-y-2 text-sm">
            <p><strong>Periode:</strong> {data.periode}</p>
            <p><strong>Anggaran Terpakai:</strong> {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(data.anggaranTerpakai))}</p>
            <p><strong>Sisa Anggaran:</strong> {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(data.sisaAnggaran))}</p>
            <p><strong>Rincian Pengeluaran:</strong> {data.rincianPengeluaran}</p>
          </div>
        );

      case 'INSIDEN_KENDALA':
        return (
          <div className="space-y-2 text-sm">
            <p><strong>Tanggal Kejadian:</strong> {new Date(data.tanggalKejadian).toLocaleDateString('id-ID')}</p>
            <p><strong>Jenis Insiden:</strong> {data.jenisInsiden}</p>
            <p><strong>Deskripsi:</strong> {data.deskripsi}</p>
            <p><strong>Dampak:</strong> {data.dampak}</p>
            <p><strong>Tindakan yang Diambil:</strong> {data.tindakanDiambil}</p>
          </div>
        );

      case 'KEGIATAN_KHUSUS':
        return (
          <div className="space-y-2 text-sm">
            <p><strong>Nama Kegiatan:</strong> {data.namaKegiatan}</p>
            <p><strong>Tanggal:</strong> {new Date(data.tanggal).toLocaleDateString('id-ID')}</p>
            <p><strong>Jumlah Peserta:</strong> {data.peserta}</p>
            <p><strong>Deskripsi:</strong> {data.deskripsi}</p>
            <p><strong>Hasil:</strong> {data.hasil}</p>
          </div>
        );

      default:
        return (
          <div className="text-sm">
            <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
          </div>
        );
    }
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <Pagination className="mt-6">
        <PaginationContent>
          {pagination.hasPrev && (
            <PaginationItem>
              <PaginationPrevious 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(pagination.currentPage - 1);
                }}
              />
            </PaginationItem>
          )}
          
          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === pagination.currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          {pagination.hasNext && (
            <PaginationItem>
              <PaginationNext 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(pagination.currentPage + 1);
                }}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari laporan berdasarkan pembuat atau jenis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType} defaultValue="all">
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter jenis laporan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jenis</SelectItem>
              <SelectItem value="PROGRES_RUTIN">Progres Rutin</SelectItem>
              <SelectItem value="PENCAPAIAN_MILESTONE">Pencapaian Milestone</SelectItem>
              <SelectItem value="KEUANGAN">Laporan Keuangan</SelectItem>
              <SelectItem value="INSIDEN_KENDALA">Insiden/Kendala</SelectItem>
              <SelectItem value="KEGIATAN_KHUSUS">Kegiatan Khusus</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? 'Mencari...' : 'Cari'}
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Riwayat Laporan ({pagination.totalCount})
        </h3>
        <p className="text-sm text-muted-foreground">
          Halaman {pagination.currentPage} dari {pagination.totalPages}
        </p>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Memuat laporan...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchTerm || (filterType && filterType !== 'all') ? 'Tidak ada laporan yang sesuai dengan pencarian.' : 'Belum ada laporan yang dibuat.'}
          </p>
          {!searchTerm && (!filterType || filterType === 'all') && (
            <p className="text-sm text-muted-foreground mt-2">
              Mulai buat laporan untuk melacak progres program.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">
                      <Badge 
                        variant={getReportTypeBadgeVariant(report.tipeLaporan)}
                        className="mr-2"
                      >
                        {getReportTypeLabel(report.tipeLaporan)}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Dibuat oleh {report.createdBy.name} pada {formatDate(report.createdAt)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {renderReportContent(report.tipeLaporan, report.data)}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
}