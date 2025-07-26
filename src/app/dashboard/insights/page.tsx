'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart3 } from 'lucide-react';

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
      return <span className="text-red-600">Belum ada laporan ({diffDays} hari sejak dibuat)</span>;
    }
    
    const lastReportDate = new Date(program.laporanProgres[0].createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastReportDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} hari yang lalu`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-[#1E40AF]" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Insights & Analytics</h1>
          <p className="text-gray-600">Dashboard analitik program CSR PLN UIP Kota Makassar</p>
        </div>
      </div>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Laporan dari Template</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Select onValueChange={setSelectedTemplate} value={selectedTemplate}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Pilih template laporan..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="budget_analysis">Analisis Anggaran vs Realisasi</SelectItem>
              <SelectItem value="at_risk_programs">Daftar Program Berisiko (Inaktif)</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleGenerateReport} disabled={loading || !selectedTemplate}>
            {loading ? 'Memproses...' : 'Generate Laporan'}
          </Button>
        </CardContent>
      </Card>
      
      {/* Budget Analysis Results */}
      {budgetData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Hasil: Anggaran vs Realisasi per Pilar</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="pilar" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="anggaran" fill="#1E40AF" name="Anggaran" />
                <Bar dataKey="realisasi" fill="#FCD34D" name="Realisasi" />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Summary Table */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">Detail Anggaran vs Realisasi</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pilar TJSL</TableHead>
                    <TableHead className="text-right">Anggaran</TableHead>
                    <TableHead className="text-right">Realisasi</TableHead>
                    <TableHead className="text-right">Persentase</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetData.map((item) => (
                    <TableRow key={item.pilar}>
                      <TableCell className="font-medium">{item.pilar}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.anggaran)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.realisasi)}</TableCell>
                      <TableCell className="text-right">
                        {item.anggaran > 0 ? `${Math.round((item.realisasi / item.anggaran) * 100)}%` : '0%'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* At Risk Programs Results */}
      {atRiskData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Hasil: Program Berisiko (Tidak Aktif &gt; 30 Hari)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul Program</TableHead>
                  <TableHead>Penanggung Jawab</TableHead>
                  <TableHead>Status Laporan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {atRiskData.map(program => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.judul}</TableCell>
                    <TableCell>{program.penanggungJawab.name}</TableCell>
                    <TableCell>{renderDaysSinceLastReport(program)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* No Data Message */}
      {selectedTemplate && !loading && budgetData.length === 0 && atRiskData.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Tidak ada data untuk template yang dipilih.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}