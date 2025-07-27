'use client';

import { useState } from 'react';
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
import {
  Search,
  Filter,
  FileText,
  Calendar,
  User,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Target,
  Activity,
  Clock
} from 'lucide-react';

interface LaporanProgres {
  id: string;
  tipeLaporan: string;
  data: Record<string, string | number | Date>;
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

  const getReportTypeBadgeClassName = (type: string) => {
    switch (type) {
      case 'PROGRES_RUTIN':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'PENCAPAIAN_MILESTONE':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'KEUANGAN':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'INSIDEN_KENDALA':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'KEGIATAN_KHUSUS':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'PROGRES_RUTIN':
        return <TrendingUp className="h-4 w-4" />;
      case 'PENCAPAIAN_MILESTONE':
        return <Target className="h-4 w-4" />;
      case 'KEUANGAN':
        return <DollarSign className="h-4 w-4" />;
      case 'INSIDEN_KENDALA':
        return <AlertTriangle className="h-4 w-4" />;
      case 'KEGIATAN_KHUSUS':
        return <Activity className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const renderReportContent = (type: string, data: Record<string, string | number | Date>) => {
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
    const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mt-6">
        <CardContent className="p-4">
          <Pagination>
            <PaginationContent>
              {pagination.hasPrev && (
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(pagination.currentPage - 1);
                    }}
                    className="hover:bg-blue-50 hover:text-blue-700"
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
                    className={page === pagination.currentPage
                      ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800"
                      : "hover:bg-blue-50 hover:text-blue-700"
                    }
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
                    className="hover:bg-blue-50 hover:text-blue-700"
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600" />
            <Input
              placeholder="Cari laporan berdasarkan pembuat atau jenis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 bg-white/80 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType} defaultValue="all">
              <SelectTrigger className="w-48 bg-white/80 border-blue-200">
                <Filter className="h-4 w-4 mr-2 text-blue-600" />
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
            
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
            >
              {loading ? 'Mencari...' : 'Cari'}
            </Button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Riwayat Laporan ({pagination.totalCount})
        </h3>
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <Clock className="h-4 w-4" />
          Halaman {pagination.currentPage} dari {pagination.totalPages}
        </p>
      </div>

      {/* Reports List */}
      {loading ? (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full flex items-center justify-center animate-pulse">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <p className="text-gray-600">Memuat laporan...</p>
            </div>
          </CardContent>
        </Card>
      ) : reports.length === 0 ? (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
              <FileText className="h-10 w-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || (filterType && filterType !== 'all') ? 'Tidak Ada Hasil' : 'Belum Ada Laporan'}
            </h3>
            <p className="text-gray-600 text-center max-w-md">
              {searchTerm || (filterType && filterType !== 'all')
                ? 'Tidak ada laporan yang sesuai dengan pencarian Anda. Coba ubah kata kunci atau filter.'
                : 'Belum ada laporan yang dibuat untuk program ini. Mulai buat laporan untuk melacak progres program.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                        {getReportTypeIcon(report.tipeLaporan)}
                      </div>
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Badge
                            variant={getReportTypeBadgeVariant(report.tipeLaporan)}
                            className={`${getReportTypeBadgeClassName(report.tipeLaporan)} font-medium`}
                          >
                            {getReportTypeLabel(report.tipeLaporan)}
                          </Badge>
                        </CardTitle>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {report.createdBy.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(report.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  {renderReportContent(report.tipeLaporan, report.data)}
                </div>
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