'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, FileText, Activity } from 'lucide-react';

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

// Warna untuk chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function OverviewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // Proteksi halaman - hanya Admin yang bisa akses
  useEffect(() => {
    if (status === 'loading') return; // Masih loading session
    
    if (!session?.user) {
      router.push('/login');
      return;
    }
    
    if (session.user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
  }, [session, status, router]);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch('/api/dashboard-metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error("Gagal fetch metrics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== 'ADMIN') {
    return null; // Akan di-redirect oleh useEffect di atas
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">Gagal memuat data dashboard.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      {/* Kartu Metrik Utama */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Program Aktif</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProgram}</div>
            <p className="text-xs text-muted-foreground">Program yang sedang berjalan</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proposal</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProposal}</div>
            <p className="text-xs text-muted-foreground">Proposal yang diajukan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Anggaran</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('id-ID', { 
                style: 'currency', 
                currency: 'IDR',
                notation: 'compact',
                maximumFractionDigits: 1
              }).format(metrics.totalAnggaran)}
            </div>
            <p className="text-xs text-muted-foreground">Anggaran program aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Laporan Terbaru</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.recentReports.length}</div>
            <p className="text-xs text-muted-foreground">Laporan dalam 5 terakhir</p>
          </CardContent>
        </Card>
      </div>

      {/* Grafik dan Visualisasi */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Grafik Anggaran per Pilar */}
        <Card>
          <CardHeader>
            <CardTitle>Alokasi Anggaran per Pilar TJSL</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.budgetByPillar}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tickFormatter={(value) => 
                    new Intl.NumberFormat('id-ID', { 
                      notation: 'compact',
                      style: 'currency',
                      currency: 'IDR'
                    }).format(value)
                  } 
                />
                <Tooltip 
                  formatter={(value) => [
                    new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR'
                    }).format(Number(value)),
                    'Anggaran'
                  ]}
                />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Anggaran" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Grafik Status Program */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Status Program</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metrics.programByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {metrics.programByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Daftar Aktivitas Terbaru */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.recentReports.length > 0 ? (
              metrics.recentReports.map((report) => (
                <div key={report.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {report.program.judul}
                    </p>
                    <p className="text-sm text-gray-500">
                      Laporan {report.tipeLaporan.replace(/_/g, ' ').toLowerCase()} 
                      oleh {report.createdBy.name || 'Unknown'}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-500">
                    {new Date(report.createdAt).toLocaleDateString('id-ID')}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Belum ada laporan terbaru</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}