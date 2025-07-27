// app/about/page.tsx
import Link from 'next/link';
import { PublicNavbar } from '@/components/PublicNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Target,
  Eye,
  Award,
  Users,
  Zap,
  Heart,
  Leaf,
  Building2,
  CheckCircle,
  TrendingUp,
  Globe,
  Lightbulb
} from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  const visionMission = [
    {
      icon: Eye,
      title: "Visi PLN",
      description: "Diakui sebagai Perusahaan Kelas Dunia yang Bertumbuh-kembang, Unggul dan Terpercaya dengan bertumpu pada Potensi Insani.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Target,
      title: "Misi PLN",
      description: "Menjalankan bisnis kelistrikan dan bidang lain yang terkait, berorientasi pada kepuasan pelanggan, anggota perusahaan dan pemegang saham.",
      color: "from-green-500 to-green-600"
    }
  ];

  const tjslPillars = [
    {
      icon: Users,
      title: "Program Kemitraan",
      description: "Pemberdayaan Usaha Kecil melalui pinjaman, pelatihan, pemasaran, dan bimbingan teknis untuk meningkatkan kemampuan usaha kecil.",
      achievements: ["Pinjaman Modal Usaha", "Pelatihan Manajemen", "Bimbingan Teknis"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Leaf,
      title: "Program Bina Lingkungan",
      description: "Program pemberdayaan kondisi sosial masyarakat, pelestarian alam, dan peningkatan kualitas lingkungan hidup.",
      achievements: ["Bantuan Korban Bencana", "Pelestarian Alam", "Sarana Ibadah & Pendidikan"],
      color: "from-green-500 to-green-600"
    },
    {
      icon: Zap,
      title: "Infrastruktur Kelistrikan",
      description: "Pembangunan infrastruktur kelistrikan untuk mendukung program pemerintah dalam pemerataan akses listrik.",
      achievements: ["Elektrifikasi Desa", "Jaringan Distribusi", "Pembangkit Listrik"],
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: Heart,
      title: "Pemberdayaan Masyarakat",
      description: "Program peningkatan kapasitas masyarakat melalui pendidikan, kesehatan, dan pengembangan ekonomi lokal.",
      achievements: ["Beasiswa Pendidikan", "Fasilitas Kesehatan", "Pelatihan Keterampilan"],
      color: "from-red-500 to-red-600"
    }
  ];

  const achievements = [
    {
      icon: Award,
      title: "BUMN Award",
      description: "Penghargaan dari Kementerian BUMN untuk kategori TJSL dan Kemitraan terbaik",
      year: "2023"
    },
    {
      icon: Globe,
      title: "Proper Hijau",
      description: "Penghargaan PROPER (Program Penilaian Peringkat Kinerja Perusahaan) dari Kementerian Lingkungan Hidup",
      year: "2023"
    },
    {
      icon: TrendingUp,
      title: "Indonesia Sustainability Reporting Awards",
      description: "Penghargaan untuk laporan keberlanjutan terbaik kategori BUMN",
      year: "2022"
    },
    {
      icon: Lightbulb,
      title: "Digital Innovation Award",
      description: "Penghargaan inovasi digital dalam pengelolaan program TJSL dan monitoring CSR",
      year: "2024"
    }
  ];

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
                <span className="text-[#FCD34D] font-semibold text-sm">Tentang TJSL PLN</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Tentang TJSL
              </h1>
              
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                Tanggung Jawab Sosial dan Lingkungan (TJSL) PLN merupakan komitmen berkelanjutan untuk berkontribusi dalam pembangunan ekonomi yang berkelanjutan
              </p>
            </div>
          </div>
        </section>

        {/* About TJSL Section */}
        <section className="w-full py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center px-4 py-2 bg-[#1E40AF]/10 rounded-full mb-6">
                    <Target className="w-4 h-4 text-[#1E40AF] mr-2" />
                    <span className="text-[#1E40AF] font-semibold text-sm">Tentang TJSL</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Komitmen PLN untuk Indonesia
                  </h2>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Tanggung Jawab Sosial dan Lingkungan (TJSL) PLN merupakan komitmen berkelanjutan untuk berkontribusi dalam pembangunan ekonomi berkelanjutan dengan meningkatkan kualitas kehidupan karyawan dan keluarganya, komunitas lokal, dan masyarakat secara luas.
                  </p>
                  
                  <p className="text-gray-600 leading-relaxed mb-8">
                    Sebagai BUMN, PLN menjalankan TJSL sesuai dengan Peraturan Menteri BUMN Nomor PER-02/MBU/7/2017 tentang Perubahan Kedua atas Peraturan Menteri BUMN Nomor PER-05/MBU/2007 tentang Program Kemitraan BUMN dengan Usaha Kecil dan Program Bina Lingkungan.
                  </p>
                  
                  <div className="flex items-center gap-2 text-[#1E40AF] font-semibold">
                    <CheckCircle size={20} />
                    <span>Komitmen Berkelanjutan untuk Indonesia</span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="bg-gradient-to-br from-[#1E40AF]/10 to-[#FCD34D]/10 rounded-3xl p-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-[#1E40AF] mb-2">15+</div>
                        <div className="text-gray-600 text-sm font-semibold">Tahun Pengalaman</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-[#1E40AF] mb-2">500+</div>
                        <div className="text-gray-600 text-sm font-semibold">Program Terlaksana</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-[#1E40AF] mb-2">10M+</div>
                        <div className="text-gray-600 text-sm font-semibold">Beneficiaries</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-[#1E40AF] mb-2">34</div>
                        <div className="text-gray-600 text-sm font-semibold">Provinsi</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="w-full py-20 bg-gradient-to-br from-[#1E40AF]/5 to-[#FCD34D]/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Visi & Misi PLN
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Landasan filosofis yang mengarahkan seluruh aktivitas dan program TJSL PLN
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {visionMission.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:scale-105 bg-white overflow-hidden">
                    <CardHeader className="items-center pb-4 pt-8">
                      <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl text-center text-gray-900 font-bold">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center px-6 pb-8">
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* TJSL Pillars */}
        <section className="w-full py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-[#1E40AF]/10 rounded-full mb-6">
                <Target className="w-4 h-4 text-[#1E40AF] mr-2" />
                <span className="text-[#1E40AF] font-semibold text-sm">Pilar TJSL</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Program TJSL PLN
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Program Tanggung Jawab Sosial dan Lingkungan PLN yang meliputi Program Kemitraan dan Program Bina Lingkungan sesuai dengan regulasi BUMN
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {tjslPillars.map((pillar, index) => {
                const IconComponent = pillar.icon;
                return (
                  <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:scale-105 bg-white overflow-hidden">
                    <div className={`h-1 bg-gradient-to-r ${pillar.color}`}></div>
                    <CardHeader className="pb-4 pt-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${pillar.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-xl text-gray-900 group-hover:text-[#1E40AF] transition-colors font-bold">
                          {pillar.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {pillar.description}
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 text-sm mb-3">Pencapaian:</h4>
                        {pillar.achievements.map((achievement, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                            <span className="text-gray-600 text-sm">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="w-full py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-[#1E40AF]/10 rounded-full mb-6">
                <Award className="w-4 h-4 text-[#1E40AF] mr-2" />
                <span className="text-[#1E40AF] font-semibold text-sm">Penghargaan</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Penghargaan & Sertifikasi
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Pengakuan atas komitmen dan kinerja PLN dalam menjalankan program TJSL
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon;
                return (
                  <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:scale-105 bg-white text-center">
                    <CardHeader className="items-center pb-4 pt-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-[#FCD34D]" />
                      </div>
                      <div className="text-2xl font-bold text-[#1E40AF] mb-2">{achievement.year}</div>
                      <CardTitle className="text-lg text-center text-gray-900 font-bold leading-tight">
                        {achievement.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-8">
                      <p className="text-gray-600 leading-relaxed text-sm">
                        {achievement.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
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