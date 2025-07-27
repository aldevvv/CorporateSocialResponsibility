// app/programs/page.tsx
import Link from 'next/link';
import { PublicNavbar } from '@/components/PublicNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar,
  MapPin,
  Star,
  CheckCircle,
  Zap,
  Heart,
  Leaf,
  Users,
  TrendingUp,
  Award,
  Building2,
  Target
} from 'lucide-react';
import Image from 'next/image';

export default function ProgramsPage() {
  // Sample data untuk demo tanpa fetch dari backend
  const programs = [
    {
      id: 1,
      judul: "Program Elektrifikasi Desa Terpencil",
      lokasiKabupaten: "Kabupaten Toraja Utara",
      status: "BERJALAN",
      createdAt: new Date("2024-01-15"),
      progress: 75,
      kategori: "Infrastruktur Energi",
      beneficiaries: 2500,
      budget: "Rp 15.5 Miliar",
      description: "Program pembangunan infrastruktur kelistrikan untuk memberikan akses listrik kepada masyarakat di daerah terpencil Kabupaten Toraja Utara."
    },
    {
      id: 2,
      judul: "Pemberdayaan UMKM Berbasis Energi Hijau",
      lokasiKabupaten: "Kota Makassar",
      status: "SELESAI",
      createdAt: new Date("2023-11-20"),
      progress: 100,
      kategori: "Pemberdayaan Masyarakat",
      beneficiaries: 850,
      budget: "Rp 8.2 Miliar",
      description: "Program pelatihan dan pemberdayaan UMKM dengan fokus pada penggunaan energi terbarukan dan teknologi ramah lingkungan."
    },
    {
      id: 3,
      judul: "Konservasi Lingkungan dan Penghijauan",
      lokasiKabupaten: "Kabupaten Bone",
      status: "BERJALAN",
      createdAt: new Date("2024-02-10"),
      progress: 60,
      kategori: "Lingkungan Hidup",
      beneficiaries: 5000,
      budget: "Rp 12.8 Miliar",
      description: "Program konservasi lingkungan melalui penanaman pohon dan edukasi masyarakat tentang pentingnya menjaga kelestarian alam."
    },
    {
      id: 4,
      judul: "Bantuan Kesehatan Masyarakat Terpencil",
      lokasiKabupaten: "Kabupaten Luwu",
      status: "BERJALAN",
      createdAt: new Date("2024-03-05"),
      progress: 45,
      kategori: "Sosial Kemanusiaan",
      beneficiaries: 3200,
      budget: "Rp 9.7 Miliar",
      description: "Program bantuan kesehatan berupa fasilitas medis dan tenaga kesehatan untuk masyarakat di daerah terpencil."
    },
    {
      id: 5,
      judul: "Pengembangan Energi Surya Komunitas",
      lokasiKabupaten: "Kabupaten Gowa",
      status: "PERENCANAAN",
      createdAt: new Date("2024-04-12"),
      progress: 25,
      kategori: "Infrastruktur Energi",
      beneficiaries: 1800,
      budget: "Rp 18.3 Miliar",
      description: "Program instalasi panel surya untuk komunitas sebagai sumber energi alternatif yang berkelanjutan."
    },
    {
      id: 6,
      judul: "Beasiswa Pendidikan Anak Kurang Mampu",
      lokasiKabupaten: "Kota Makassar",
      status: "BERJALAN",
      createdAt: new Date("2024-01-20"),
      progress: 80,
      kategori: "Sosial Kemanusiaan",
      beneficiaries: 500,
      budget: "Rp 5.5 Miliar",
      description: "Program beasiswa pendidikan untuk anak-anak dari keluarga kurang mampu di wilayah Kota Makassar."
    }
  ];

  const getCategoryIcon = (kategori: string) => {
    switch (kategori) {
      case "Infrastruktur Energi":
        return Zap;
      case "Lingkungan Hidup":
        return Leaf;
      case "Pemberdayaan Masyarakat":
        return Users;
      case "Sosial Kemanusiaan":
        return Heart;
      default:
        return Target;
    }
  };

  const getCategoryColor = (kategori: string) => {
    switch (kategori) {
      case "Infrastruktur Energi":
        return "from-blue-500 to-blue-600";
      case "Lingkungan Hidup":
        return "from-green-500 to-green-600";
      case "Pemberdayaan Masyarakat":
        return "from-yellow-500 to-yellow-600";
      case "Sosial Kemanusiaan":
        return "from-red-500 to-red-600";
      default:
        return "from-purple-500 to-purple-600";
    }
  };

  return (
    <>
      <PublicNavbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative w-full py-16 md:py-20 bg-gradient-to-br from-[#1E40AF] via-[#1E3A8A] to-[#1E40AF] overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1E40AF]/20 via-transparent to-[#FCD34D]/10"></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-20 right-20 w-72 h-72 bg-[#FCD34D] rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#3B82F6] rounded-full blur-3xl"></div>
            </div>
          </div>
          
          <div className="container relative z-10 mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="inline-flex items-center px-4 py-2 bg-[#FCD34D]/20 backdrop-blur-sm rounded-full border border-[#FCD34D]/30 mb-8">
                <Building2 className="w-4 h-4 text-[#FCD34D] mr-2" />
                <span className="text-[#FCD34D] font-semibold text-sm">Program CSR PLN</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Program Kami
              </h1>
              
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                Berbagai program Corporate Social Responsibility PLN UIP Kota Makassar yang memberikan dampak positif bagi masyarakat Indonesia
              </p>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="w-full py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-[#1E40AF] mb-2">{programs.length}</div>
                <div className="text-gray-600 font-semibold text-sm">Total Program</div>
              </div>
              
              <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-[#1E40AF] mb-2">
                  {programs.reduce((sum, program) => sum + program.beneficiaries, 0).toLocaleString()}
                </div>
                <div className="text-gray-600 font-semibold text-sm">Beneficiaries</div>
              </div>
              
              <div className="text-center bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FCD34D] to-[#F59E0B] rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-[#1E40AF]" />
                </div>
                <div className="text-3xl font-bold text-[#1E40AF] mb-2">
                  {programs.filter(p => p.status === 'BERJALAN').length}
                </div>
                <div className="text-gray-600 font-semibold text-sm">Program Aktif</div>
              </div>
              
              <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-[#1E40AF] mb-2">
                  {programs.filter(p => p.status === 'SELESAI').length}
                </div>
                <div className="text-gray-600 font-semibold text-sm">Program Selesai</div>
              </div>
            </div>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="w-full py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Daftar Program CSR
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Program-program CSR PLN yang telah dan sedang berjalan untuk memberikan dampak positif bagi masyarakat
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {programs.map(program => {
                const CategoryIcon = getCategoryIcon(program.kategori);
                return (
                  <Card key={program.id} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden bg-white hover:scale-105">
                    <div className="h-2 bg-gradient-to-r from-[#1E40AF] to-[#FCD34D]"></div>
                    <CardHeader className="pb-4 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 bg-gradient-to-br ${getCategoryColor(program.kategori)} rounded-lg flex items-center justify-center`}>
                            <CategoryIcon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                            {program.kategori}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            program.status === 'SELESAI' ? 'bg-green-500' : 
                            program.status === 'BERJALAN' ? 'bg-[#1E40AF]' : 
                            program.status === 'PERENCANAAN' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}></div>
                          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                            program.status === 'SELESAI' ? 'text-green-700 bg-green-100' : 
                            program.status === 'BERJALAN' ? 'text-[#1E40AF] bg-blue-100' : 
                            program.status === 'PERENCANAAN' ? 'text-yellow-700 bg-yellow-100' : 'text-gray-700 bg-gray-100'
                          }`}>
                            {program.status === 'SELESAI' ? 'Completed' : 
                             program.status === 'BERJALAN' ? 'Ongoing' : 
                             program.status === 'PERENCANAAN' ? 'Planning' : program.status}
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-xl text-gray-900 group-hover:text-[#1E40AF] transition-colors font-bold leading-tight">
                        {program.judul}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {program.description}
                      </p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-600">
                          <MapPin size={16} className="text-[#1E40AF]" />
                          <span className="text-sm font-medium">{program.lokasiKabupaten}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <Calendar size={16} className="text-[#1E40AF]" />
                          <span className="text-sm font-medium">
                            {new Date(program.createdAt).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <Users size={16} className="text-[#1E40AF]" />
                          <span className="text-sm font-medium">{program.beneficiaries.toLocaleString()} Beneficiaries</span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold text-gray-600">Progress</span>
                          <span className="text-xs font-semibold text-[#1E40AF]">{program.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-[#1E40AF] to-[#FCD34D] h-2 rounded-full transition-all duration-500"
                            style={{ width: `${program.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#1E40AF] font-semibold text-sm">
                          <CheckCircle size={16} />
                          <span>Program Aktif</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Budget</div>
                          <div className="text-sm font-bold text-[#1E40AF]">{program.budget}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Same as landing page */}
      <footer className="w-full bg-gradient-to-br from-[#1E40AF] via-[#1E3A8A] to-[#1E40AF] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FCD34D]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#3B82F6]/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="py-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              <div className="lg:col-span-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-16 h-16 bg-white/10 rounded-2xl p-2 backdrop-blur-sm">
                    <Image
                      src="/PLN.png"
                      alt="PLN Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-2xl">SIM CSR PLN</span>
                    <span className="text-[#FCD34D] text-sm font-semibold">PLN UIP Kota Makassar</span>
                  </div>
                </div>
                <p className="text-blue-100 text-sm leading-relaxed mb-6">
                  Sistem Informasi Monitoring Corporate Social Responsibility untuk transparansi dan akuntabilitas program CSR PLN Indonesia.
                </p>
                <div className="flex items-center gap-2 text-[#FCD34D] text-sm font-semibold">
                  <CheckCircle size={16} />
                  <span>Platform Terpercaya</span>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <h3 className="text-white font-bold text-lg mb-6">Navigasi</h3>
                <div className="space-y-4">
                  <Link href="/" className="block text-blue-100 hover:text-[#FCD34D] transition-colors duration-300 text-sm">
                    Beranda
                  </Link>
                  <Link href="/programs" className="block text-blue-100 hover:text-[#FCD34D] transition-colors duration-300 text-sm">
                    Program Kami
                  </Link>
                  <Link href="/about" className="block text-blue-100 hover:text-[#FCD34D] transition-colors duration-300 text-sm">
                    Tentang TJSL
                  </Link>
                  <Link href="/contact" className="block text-blue-100 hover:text-[#FCD34D] transition-colors duration-300 text-sm">
                    Kontak
                  </Link>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <h3 className="text-white font-bold text-lg mb-6">Informasi</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-[#FCD34D] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-blue-100 text-sm font-semibold">PT PLN (Persero)</p>
                      <p className="text-blue-200 text-xs">Unit Induk Pembangunan Kota Makassar</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-blue-100 text-sm mb-1">
                  © {new Date().getFullYear()} PT PLN (Persero) - CSR Monitoring Platform
                </p>
                <p className="text-blue-200 text-xs">
                  Sistem Informasi Monitoring Program CSR Indonesia
                </p>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-blue-200 text-xs">
                  Version 1.0.0
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-200 text-xs">System Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}