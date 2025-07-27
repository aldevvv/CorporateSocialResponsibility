'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart3, AlertTriangle } from 'lucide-react';

// Tipe data untuk laporan
type BudgetData = { pilar: string; anggaran: number; realisasi: number };
type AtRiskData = { 
  id: string; 
  judul: string; 
  penanggungJawab: { name: string }; 
  laporanProgres: { createdAt: string }[];
  createdAt: string;
};

export default function InsightsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  // State terpisah untuk setiap jenis data
  const [budgetData, setBudgetData] = useState<BudgetData[]>([]);
  const [atRiskData, setAtRiskData] = useState<AtRiskData[]>([]);

  const handleGenerateReport = async () => {
    if (!selectedTemplate) return;

    setLoading(true);
    setBudgetData([]);
    setAtRiskData([]);

    try {
      let response;
      if (selectedTemplate === 'budget_analysis') {
        response = await fetch('/api/insights/budget-analysis');
        const result = await response.json();
        setBudgetData(result);
      } else if (selectedTemplate === 'at_risk_programs') {
        response = await fetch('/api/insights/at-risk-programs');
        const result = await response.json();
        setAtRiskData(result);
      }
    } catch (error) {
      console.error("Gagal generate laporan:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderDaysSinceLastReport = (program: AtRiskData) => {
    if (program.laporanProgres.length === 0) {
      // Hitung hari sejak program dibuat
      const createdDate = new Date(program.createdAt);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - createdDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return <span className="text-red-600 font-medium">Belum ada laporan ({diffDays} hari sejak dibuat)</span>;
    }
    
    const lastReportDate = new Date(program.laporanProgres[0].createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastReportDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return <span className="text-orange-600 font-medium">{diffDays} hari yang lalu</span>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Template Selection Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Laporan dari Template
          </h2>
          <p className="text-green-100 text-sm mt-1">
            Pilih template untuk menghasilkan laporan analitik
          </p>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 w-full sm:w-auto">
              <Select onValueChange={setSelectedTemplate} value={selectedTemplate}>
                <SelectTrigger className="w-full sm:w-[350px] h-12 border-2 border-gray-200 hover:border-green-300 transition-colors">
                  <SelectValue placeholder="Pilih template laporan..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget_analysis">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Analisis Anggaran vs Realisasi
                    </div>
                  </SelectItem>
                  <SelectItem value="at_risk_programs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Daftar Program Berisiko (Inaktif)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleGenerateReport} 
              disabled={loading || !selectedTemplate}
              className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Memproses...
                </div>
              ) : (
                'Generate Laporan'
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Budget Analysis Results */}
      {budgetData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Hasil: Anggaran vs Realisasi per Pilar
            </h3>
            <p className="text-blue-100 text-sm mt-1">
              Analisis perbandingan anggaran dan realisasi berdasarkan pilar TJSL
            </p>
          </div>
          <div className="p-6">
            {/* Chart Container */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={budgetData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="pilar" 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#64748b' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value)} 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#64748b' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="anggaran" fill="#2563eb" name="Anggaran" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="realisasi" fill="#f59e0b" name="Realisasi" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Summary Table */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Detail Anggaran vs Realisasi</h4>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-900">Pilar TJSL</TableHead>
                      <TableHead className="text-right font-semibold text-gray-900">Anggaran</TableHead>
                      <TableHead className="text-right font-semibold text-gray-900">Realisasi</TableHead>
                      <TableHead className="text-right font-semibold text-gray-900">Persentase</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budgetData.map((item) => (
                      <TableRow key={item.pilar} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium text-gray-900">{item.pilar}</TableCell>
                        <TableCell className="text-right text-gray-700">{formatCurrency(item.anggaran)}</TableCell>
                        <TableCell className="text-right text-gray-700">{formatCurrency(item.realisasi)}</TableCell>
                        <TableCell className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.anggaran > 0 && (item.realisasi / item.anggaran) >= 0.8
                              ? 'bg-green-100 text-green-800'
                              : item.anggaran > 0 && (item.realisasi / item.anggaran) >= 0.5
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.anggaran > 0 ? `${Math.round((item.realisasi / item.anggaran) * 100)}%` : '0%'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* At Risk Programs Results */}
      {atRiskData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-rose-700 px-6 py-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Hasil: Program Berisiko (Tidak Aktif &gt; 30 Hari)
            </h3>
            <p className="text-red-100 text-sm mt-1">
              Daftar program yang memerlukan perhatian khusus karena tidak aktif
            </p>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">Judul Program</TableHead>
                    <TableHead className="font-semibold text-gray-900">Penanggung Jawab</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status Laporan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {atRiskData.map(program => (
                    <TableRow key={program.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium text-gray-900">{program.judul}</TableCell>
                      <TableCell className="text-gray-700">{program.penanggungJawab.name}</TableCell>
                      <TableCell>{renderDaysSinceLastReport(program)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {/* No Data Message */}
      {selectedTemplate && !loading && budgetData.length === 0 && atRiskData.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden">
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak Ada Data</h3>
            <p className="text-gray-500">Tidak ada data untuk template yang dipilih.</p>
          </div>
        </div>
      )}
    </div>
  );
}