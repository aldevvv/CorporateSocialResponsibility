// app/dashboard/proposals/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProposalActions } from './components/ProposalActions';
import { TjslPillar, ProposalStatus } from '@prisma/client';
import {
  Search,
  Filter,
  Plus,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

interface Proposal {
  id: string;
  judul: string;
  pilar: TjslPillar;
  ringkasan: string | null;
  lokasiKabupaten: string;
  lokasiKecamatan: string;
  lokasiDesa: string | null;
  latarBelakang: string;
  tujuanProgram: string;
  indikatorKeberhasilan: string;
  targetPenerimaManfaat: string;
  jumlahPenerimaManfaat: number;
  estimasiAnggaran: number; // Decimal type from Prisma
  perkiraanMulai: Date;
  perkiraanSelesai: Date;
  status: ProposalStatus;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    name: string | null;
  };
}

// Fungsi untuk mendapatkan variant Badge berdasarkan status
function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'DRAFT':
      return 'secondary';
    case 'DIAJUKAN':
      return 'default';
    case 'DISETUJUI':
      return 'default';
    case 'DITOLAK':
      return 'destructive';
    case 'SELESAI':
      return 'default';
    default:
      return 'secondary';
  }
}

// Fungsi untuk mendapatkan className tambahan untuk warna custom
function getStatusBadgeClassName(status: string) {
  switch (status) {
    case 'DISETUJUI':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'SELESAI':
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    default:
      return '';
  }
}

// Fungsi untuk mendapatkan icon berdasarkan status
function getStatusIcon(status: string) {
  switch (status) {
    case 'DRAFT':
      return <AlertCircle className="h-4 w-4" />;
    case 'DIAJUKAN':
      return <Clock className="h-4 w-4" />;
    case 'DISETUJUI':
      return <CheckCircle className="h-4 w-4" />;
    case 'DITOLAK':
      return <XCircle className="h-4 w-4" />;
    case 'SELESAI':
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pilarFilter, setPilarFilter] = useState('all');

  // Fetch proposals data
  useEffect(() => {
    async function fetchProposals() {
      try {
        const response = await fetch('/api/proposals');
        const data = await response.json();
        setProposals(data);
        setFilteredProposals(data);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProposals();
  }, []);

  // Filter proposals based on search and filters
  useEffect(() => {
    let filtered = proposals;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(proposal =>
        proposal.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.createdBy.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(proposal => proposal.status === statusFilter);
    }

    // Pilar filter
    if (pilarFilter !== 'all') {
      filtered = filtered.filter(proposal => proposal.pilar === pilarFilter);
    }

    setFilteredProposals(filtered);
  }, [proposals, searchTerm, statusFilter, pilarFilter]);

  // Calculate statistics
  const stats = {
    total: proposals.length,
    draft: proposals.filter(p => p.status === 'DRAFT').length,
    diajukan: proposals.filter(p => p.status === 'DIAJUKAN').length,
    disetujui: proposals.filter(p => p.status === 'DISETUJUI').length,
    ditolak: proposals.filter(p => p.status === 'DITOLAK').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-lg font-medium text-gray-600">Memuat proposal...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Manajemen Proposal
          </h1>
          <p className="text-gray-600 mt-1">Kelola proposal program TJSL PLN UIP Makassar</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg w-fit">
          <Link href="/dashboard/proposals/new" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Buat Proposal Baru</span>
          </Link>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <Card className="hover:shadow-lg transition-all duration-300 border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Proposal</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Draft</CardTitle>
            <AlertCircle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Diajukan</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.diajukan}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Disetujui</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.disetujui}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ditolak</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.ditolak}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Filter className="h-5 w-5 text-blue-600" />
            <span>Filter & Pencarian</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari berdasarkan judul atau pembuat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="DIAJUKAN">Diajukan</SelectItem>
                  <SelectItem value="DISETUJUI">Disetujui</SelectItem>
                  <SelectItem value="DITOLAK">Ditolak</SelectItem>
                  <SelectItem value="SELESAI">Selesai</SelectItem>
                </SelectContent>
              </Select>
              <Select value={pilarFilter} onValueChange={setPilarFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter Pilar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Pilar</SelectItem>
                  <SelectItem value="PENDIDIKAN">Pendidikan</SelectItem>
                  <SelectItem value="KESEHATAN">Kesehatan</SelectItem>
                  <SelectItem value="LINGKUNGAN">Lingkungan</SelectItem>
                  <SelectItem value="EKONOMI">Ekonomi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desktop Table View */}
      <Card className="hidden lg:block border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between text-lg">
            <span>Daftar Proposal ({filteredProposals.length})</span>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[45%] max-w-0">Judul Program</TableHead>
                <TableHead className="w-[15%]">Status</TableHead>
                <TableHead className="w-[12%]">Pilar</TableHead>
                <TableHead className="w-[15%]">Anggaran</TableHead>
                <TableHead className="w-[13%]">Tanggal</TableHead>
                <TableHead className="w-[10%] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProposals.map((proposal) => (
                <TableRow key={proposal.id} className="hover:bg-blue-50/50 transition-colors">
                  <TableCell className="font-medium max-w-0">
                    <Link
                      href={`/dashboard/proposals/${proposal.id}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline transition-colors block truncate text-sm"
                      title={proposal.judul}
                    >
                      {proposal.judul.length > 60 ? `${proposal.judul.substring(0, 60)}...` : proposal.judul}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(proposal.status)}
                      className={`${getStatusBadgeClassName(proposal.status)} flex items-center space-x-1 w-fit text-xs`}
                    >
                      {getStatusIcon(proposal.status)}
                      <span className="text-xs">{proposal.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {proposal.pilar}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        notation: 'compact',
                        maximumFractionDigits: 0
                      }).format(proposal.estimasiAnggaran || 0)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(proposal.createdAt).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                      })}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <ProposalActions proposal={proposal} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile Cards View */}
      <div className="lg:hidden space-y-4">
        {filteredProposals.map((proposal) => (
          <Card key={proposal.id} className="border shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link
                    href={`/dashboard/proposals/${proposal.id}`}
                    className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {proposal.judul}
                  </Link>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge
                      variant={getStatusBadgeVariant(proposal.status)}
                      className={`${getStatusBadgeClassName(proposal.status)} flex items-center space-x-1`}
                    >
                      {getStatusIcon(proposal.status)}
                      <span>{proposal.status}</span>
                    </Badge>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {proposal.pilar}
                    </span>
                  </div>
                </div>
                <ProposalActions proposal={proposal} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Estimasi Anggaran:</span>
                  <span className="font-semibold text-green-600">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      notation: 'compact',
                      maximumFractionDigits: 1
                    }).format(proposal.estimasiAnggaran || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Dibuat oleh:</span>
                  <span>{proposal.createdBy.name || 'Unknown'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Tanggal:</span>
                  <span>
                    {new Date(proposal.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProposals.length === 0 && !loading && (
        <Card className="border shadow-sm">
          <CardContent className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada proposal ditemukan</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'all' || pilarFilter !== 'all'
                ? 'Coba ubah filter atau kata kunci pencarian'
                : 'Belum ada proposal yang dibuat'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && pilarFilter === 'all' && (
              <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700">
                <Link href="/dashboard/proposals/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Proposal Pertama
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}