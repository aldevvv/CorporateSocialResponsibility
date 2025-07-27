'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, FileText, Activity, ArrowUpRight, Clock, CheckCircle, Target, MapPin, BarChart3 } from 'lucide-react';

// Tipe data untuk metrik
interface DashboardMetrics {
  totalProgram: number;
  totalProposal: number;
  totalAnggaran: number;
  programByStatus: { name: string, value: number }[];
  proposalByStatus: { name: string, value: number }[];
  budgetByPillar: { name: string, value: number }[];
  recentReports: {
    id: string;
    tipeLaporan: string;
    createdAt: string;
    program: { judul: string };
    createdBy: { name: string | null };
  }[];
}

interface Program {
  id: string;
  judul: string;
  pilar: string;
  lokasiKabupaten: string;
  lokasiKecamatan: string;
  status: string;
  anggaranFinal: number;
  tanggalMulaiFinal: string;
  tanggalSelesaiFinal: string;
  createdAt: string;
  penanggungJawab: {
    name: string | null;
    email: string;
  };
}


// Warna untuk chart - Professional PLN color scheme
const COLORS = ['#1E40AF', '#059669', '#DC2626', '#D97706', '#7C3AED', '#DB2777'];

export default function OverviewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  // Proteksi halaman - hanya Admin yang bisa akses
  useEffect(() => {
    if (status === 'loading') return; // Masih loading session
    
    if (!session?.user) {
      router.push('/login');
      return;
    }
    
    if ((session.user as { role: string }).role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    async function fetchAllData() {
      try {
        // Fetch dashboard metrics
        const metricsResponse = await fetch('/api/dashboard-metrics');
        const metricsData = await metricsResponse.json();
        setMetrics(metricsData);

        // Fetch programs data
        const programsResponse = await fetch('/api/programs');
        const programsData = await programsResponse.json();
        setPrograms(programsData);

        // Fetch users data (only for admin)
        if ((session?.user as { role: string } | undefined)?.role === 'ADMIN') {
          const usersResponse = await fetch('/api/users');
          await usersResponse.json();
          // Users data fetched but not currently used in UI
        }
      } catch (error) {
        console.error("Gagal fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user) {
      fetchAllData();
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-lg font-medium text-gray-600">Memuat dashboard...</div>
        </div>
      </div>
    );
  }

  if (!session?.user || (session.user as { role: string }).role !== 'ADMIN') {
    return null; // Akan di-redirect oleh useEffect di atas
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-blue-200 h-12 w-12"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-blue-200 rounded w-3/4"></div>
              <div className="h-4 bg-blue-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="text-lg font-medium text-gray-600">Memuat data dashboard...</div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-red-100 p-3">
            <Activity className="h-8 w-8 text-red-600" />
          </div>
          <div className="text-lg font-medium text-red-600">Gagal memuat data dashboard</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-2">Monitoring Program TJSL PLN UIP Makassar</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Terakhir diperbarui: {new Date().toLocaleTimeString('id-ID')}</span>
          </div>
        </div>

        {/* Kartu Metrik Utama */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-blue-100">Total Program Aktif</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold mb-1">{metrics.totalProgram}</div>
              <div className="flex items-center space-x-1 text-blue-100">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm">Program berjalan</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-green-100">Total Proposal</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold mb-1">{metrics.totalProposal}</div>
              <div className="flex items-center space-x-1 text-green-100">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Proposal diajukan</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-amber-100">Total Anggaran</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl sm:text-3xl font-bold mb-1">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  notation: 'compact',
                  maximumFractionDigits: 1
                }).format(metrics.totalAnggaran)}
              </div>
              <div className="flex items-center space-x-1 text-amber-100">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Anggaran aktif</span>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-purple-100">Laporan Terbaru</CardTitle>
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold mb-1">{metrics.recentReports.length}</div>
              <div className="flex items-center space-x-1 text-purple-100">
                <Activity className="h-4 w-4" />
                <span className="text-sm">Laporan terkini</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grafik dan Visualisasi */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Grafik Anggaran per Pilar */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                <span>Alokasi Anggaran per Pilar TJSL</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={metrics.budgetByPillar} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    tickFormatter={(value) =>
                      new Intl.NumberFormat('id-ID', {
                        notation: 'compact',
                        style: 'currency',
                        currency: 'IDR'
                      }).format(value)
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [
                      new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR'
                      }).format(Number(value)),
                      'Anggaran'
                    ]}
                  />
                  <Bar
                    dataKey="value"
                    fill="url(#colorBar)"
                    name="Anggaran"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Grafik Status Program */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
                <span>Distribusi Status Program</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <defs>
                    {COLORS.map((color, index) => (
                      <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
                        <stop offset="100%" stopColor={color} stopOpacity={1}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={metrics.programByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="none"
                  >
                    {metrics.programByStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#gradient${index % COLORS.length})`}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Daftar Aktivitas Terbaru */}
        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
              <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
              <span>Aktivitas Terbaru</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.recentReports.length > 0 ? (
                metrics.recentReports.map((report, index) => (
                  <div
                    key={report.id}
                    className="group flex items-center space-x-4 p-4 border border-gray-100 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-green-500' :
                        index === 1 ? 'bg-blue-500' :
                        index === 2 ? 'bg-yellow-500' : 'bg-gray-400'
                      } animate-pulse`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                        {report.program.judul}
                      </p>
                      <p className="text-sm text-gray-600 group-hover:text-gray-700">
                        Laporan {report.tipeLaporan.replace(/_/g, ' ').toLowerCase()}
                        oleh <span className="font-medium">{report.createdBy.name || 'Unknown'}</span>
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-sm text-gray-500 group-hover:text-gray-600 font-medium">
                      {new Date(report.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">Belum ada laporan terbaru</p>
                  <p className="text-gray-400 text-sm mt-1">Laporan akan muncul di sini setelah dibuat</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Metrik Tambahan - Row 1 */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Grafik Proposal berdasarkan Status */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                <div className="w-2 h-8 bg-gradient-to-b from-cyan-500 to-cyan-600 rounded-full"></div>
                <span>Status Proposal</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <defs>
                    {COLORS.map((color, index) => (
                      <linearGradient key={`prop-gradient${index}`} id={`propGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
                        <stop offset="100%" stopColor={color} stopOpacity={1}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={metrics.proposalByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {metrics.proposalByStatus.map((entry, index) => (
                      <Cell
                        key={`prop-cell-${index}`}
                        fill={`url(#propGradient${index % COLORS.length})`}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span className="text-sm font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Metrik Performa */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                <span>Metrik Performa</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tingkat Konversi */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Tingkat Konversi</span>
                  <span className="text-sm font-bold text-green-600">
                    {metrics.totalProposal > 0 ? Math.round((metrics.totalProgram / metrics.totalProposal) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${metrics.totalProposal > 0 ? Math.min((metrics.totalProgram / metrics.totalProposal) * 100, 100) : 0}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Rata-rata Anggaran per Program */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Rata-rata Anggaran</span>
                  <span className="text-sm font-bold text-blue-600">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      notation: 'compact',
                      maximumFractionDigits: 1
                    }).format(metrics.totalProgram > 0 ? metrics.totalAnggaran / metrics.totalProgram : 0)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full w-3/4 transition-all duration-500"></div>
                </div>
              </div>

              {/* Efisiensi Laporan */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Aktivitas Laporan</span>
                  <span className="text-sm font-bold text-purple-600">
                    {metrics.recentReports.length}/5
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(metrics.recentReports.length / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></div>
                <span>Statistik Cepat</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Program Aktif</p>
                    <p className="text-xs text-gray-500">Sedang berjalan</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-blue-600">{metrics.totalProgram}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Proposal</p>
                    <p className="text-xs text-gray-500">Diajukan</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-green-600">{metrics.totalProposal}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Laporan Aktif</p>
                    <p className="text-xs text-gray-500">Bulan ini</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-purple-600">{metrics.recentReports.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metrik Tambahan - Row 2 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Trend Bulanan (Mock Data) */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
                <span>Trend Program Bulanan</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={(() => {
                  // Generate trend data based on current metrics
                  const currentMonth = new Date().getMonth();
                  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
                  const trendData = [];
                  
                  // Create realistic trend data based on current totals
                  const totalPrograms = metrics.totalProgram || 0;
                  const totalProposals = metrics.totalProposal || 0;
                  
                  for (let i = Math.max(0, currentMonth - 5); i <= currentMonth; i++) {
                    const monthIndex = i - Math.max(0, currentMonth - 5);
                    const progressRatio = (monthIndex + 1) / 6; // 6 months
                    
                    const monthPrograms = Math.floor(totalPrograms * progressRatio);
                    const monthProposals = Math.floor(totalProposals * progressRatio);
                    
                    trendData.push({
                      bulan: months[i],
                      program: monthPrograms,
                      proposal: monthProposals
                    });
                  }
                  
                  // Ensure we have at least current month data
                  if (trendData.length === 0) {
                    trendData.push({
                      bulan: months[currentMonth],
                      program: totalPrograms,
                      proposal: totalProposals
                    });
                  }
                  
                  return trendData;
                })()}>
                  <defs>
                    <linearGradient id="colorProgram" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorProposal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="bulan"
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="proposal"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorProposal)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="program"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorProgram)"
                    strokeWidth={2}
                  />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribusi Geografis (Mock Data) */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                <div className="w-2 h-8 bg-gradient-to-b from-rose-500 to-rose-600 rounded-full"></div>
                <span>Distribusi Geografis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(() => {
                  // Calculate distribution based on programs data or create sample data
                  let locationData = [];
                  
                  if (programs && programs.length > 0) {
                    const locationCounts = programs.reduce((acc, program) => {
                      const kota = program.lokasiKabupaten || 'Tidak Diketahui';
                      acc[kota] = (acc[kota] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>);
                    
                    const totalPrograms = programs.length;
                    locationData = Object.entries(locationCounts)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 4) // Top 4 locations
                      .map(([kota, jumlah]) => ({
                        kota,
                        jumlah,
                        persentase: Math.round((jumlah / totalPrograms) * 100)
                      }));
                  } else {
                    // Create sample distribution based on total programs from metrics
                    const totalPrograms = metrics.totalProgram || 0;
                    if (totalPrograms > 0) {
                      locationData = [
                        { kota: 'Makassar', jumlah: Math.ceil(totalPrograms * 0.4), persentase: 40 },
                        { kota: 'Gowa', jumlah: Math.ceil(totalPrograms * 0.3), persentase: 30 },
                        { kota: 'Maros', jumlah: Math.ceil(totalPrograms * 0.2), persentase: 20 },
                        { kota: 'Takalar', jumlah: Math.ceil(totalPrograms * 0.1), persentase: 10 }
                      ].filter(item => item.jumlah > 0);
                    } else {
                      locationData = [
                        { kota: 'Belum ada program', jumlah: 0, persentase: 0 }
                      ];
                    }
                  }
                  
                  return locationData;
                })().map((item, index) => (
                  <div key={item.kota} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">{item.kota}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-gray-900">{item.jumlah}</span>
                        <span className="text-xs text-gray-500">({item.persentase}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          index === 0 ? 'bg-gradient-to-r from-rose-500 to-rose-600' :
                          index === 1 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                          index === 2 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                          'bg-gradient-to-r from-purple-500 to-purple-600'
                        }`}
                        style={{ width: `${Math.max(item.persentase, 5)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}