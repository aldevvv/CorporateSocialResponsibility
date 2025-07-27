// app/page.tsx
import { PublicNavbar } from '@/components/PublicNavbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Monitor,
  BarChart3,
  Users,
  Target,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  FileText,
  Calendar,
  MapPin,
  Award,
  Zap,
  Heart,
  Leaf,
  Globe,
  Lightbulb,
  Building2,
  Star,
  Upload
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  // Sample data untuk demo tanpa fetch dari backend
  const samplePrograms = [
    {
      id: 1,
      judul: "Program Elektrifikasi Desa Terpencil",
      lokasiKabupaten: "Kabupaten Toraja Utara",
      status: "BERJALAN",
      createdAt: new Date("2024-01-15"),
      progress: 75
    },
    {
      id: 2,
      judul: "Pemberdayaan UMKM Berbasis Energi Hijau",
      lokasiKabupaten: "Kota Makassar",
      status: "SELESAI",
      createdAt: new Date("2023-11-20"),
      progress: 100
    },
    {
      id: 3,
      judul: "Konservasi Lingkungan dan Penghijauan",
      lokasiKabupaten: "Kabupaten Bone",
      status: "BERJALAN",
      createdAt: new Date("2024-02-10"),
      progress: 60
    }
  ];

  const features = [
    {
      icon: FileText,
      title: "Manajemen Proposal",
      description: "Sistem pengelolaan proposal CSR dari pengajuan hingga persetujuan dengan workflow yang terstruktur dan transparan.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Monitor,
      title: "Program Monitoring",
      description: "Monitoring real-time status program CSR, progress milestone, dan pencapaian target dengan dashboard interaktif.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: BarChart3,
      title: "Pelaporan Terintegrasi",
      description: "Sistem pelaporan komprehensif untuk progress rutin, milestone, keuangan, dan insiden dengan template standar.",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: Upload,
      title: "Manajemen Dokumen",
      description: "Penyimpanan dan pengelolaan dokumen program CSR termasuk TOR, kontrak, dan dokumen pendukung lainnya.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Users,
      title: "Multi-Role Access",
      description: "Sistem akses berbasis peran untuk Administrator PLN dan Pelaksana Program dengan hak akses yang sesuai.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Lightbulb,
      title: "AI Insights",
      description: "Analisis cerdas berbasis AI untuk memberikan insight mendalam terkait performa dan dampak program CSR.",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  return (
    <>
      <PublicNavbar />
      <main className="min-h-screen">
        {/* Hero Section - Redesigned */}
        <section className="relative w-full py-8 md:py-12 lg:py-16 bg-gradient-to-br from-[#1E40AF] via-[#1E3A8A] to-[#1E40AF] overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1E40AF]/20 via-transparent to-[#FCD34D]/10"></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-20 right-20 w-72 h-72 bg-[#FCD34D] rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#3B82F6] rounded-full blur-3xl"></div>
            </div>
          </div>
          
          <div className="container relative z-10 mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center text-white mb-12">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-[#FCD34D]/20 backdrop-blur-sm rounded-full border border-[#FCD34D]/30 mb-8">
                  <Monitor className="w-4 h-4 text-[#FCD34D] mr-2" />
                  <span className="text-[#FCD34D] font-semibold text-sm">Sistem Monitoring CSR Digital</span>
                </div>
                
                {/* Main Heading */}
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6">
                  <span className="block">Platform Monitoring</span>
                  <span className="block text-[#FCD34D] bg-gradient-to-r from-[#FCD34D] to-[#F59E0B] bg-clip-text text-transparent">
                    Program CSR PLN
                  </span>
                </h1>
                
                {/* Subtitle */}
                <p className="text-lg md:text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-4xl mx-auto mb-12">
                  Sistem terintegrasi untuk memantau, mengelola, dan melaporkan seluruh program 
                  <span className="font-semibold text-[#FCD34D]"> Corporate Social Responsibility (CSR) </span>
                  PLN UIP Kota Makassar secara real-time dan transparan.
                </p>
                
              </div>

            </div>
          </div>
        </section>

        {/* Stats Section - Redesigned */}
        <section className="w-full py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-[#1E40AF]/10 rounded-full mb-6">
                <TrendingUp className="w-4 h-4 text-[#1E40AF] mr-2" />
                <span className="text-[#1E40AF] font-semibold text-sm">Impact Measurement</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Impact CSR PLN Indonesia
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Data real-time program CSR yang telah memberikan dampak positif bagi masyarakat Indonesia
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="group text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8 text-[#FCD34D]" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-[#1E40AF] mb-3">150+</div>
                <div className="text-gray-600 font-semibold">Program CSR Aktif</div>
              </div>
              
              <div className="group text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-[#1E40AF] mb-3">2.5M+</div>
                <div className="text-gray-600 font-semibold">Beneficiaries</div>
              </div>
              
              <div className="group text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FCD34D] to-[#F59E0B] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-8 h-8 text-[#1E40AF]" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-[#1E40AF] mb-3">34</div>
                <div className="text-gray-600 font-semibold">Provinsi</div>
              </div>
              
              <div className="group text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-[#1E40AF] mb-3">98%</div>
                <div className="text-gray-600 font-semibold">Success Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* CSR Focus Areas - Redesigned */}
        <section className="w-full py-20 bg-gradient-to-br from-[#1E40AF]/5 to-[#FCD34D]/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-[#1E40AF]/10 rounded-full mb-6">
                <Lightbulb className="w-4 h-4 text-[#1E40AF] mr-2" />
                <span className="text-[#1E40AF] font-semibold text-sm">Focus Areas</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Fokus Area CSR PLN
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Program CSR PLN terfokus pada empat pilar utama pembangunan berkelanjutan yang sejalan 
                dengan visi misi perusahaan dan kebutuhan masyarakat Indonesia
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#1E40AF] to-[#3B82F6]"></div>
                <CardHeader className="items-center pb-4 pt-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-8 h-8 text-[#FCD34D]" />
                  </div>
                  <CardTitle className="text-xl text-center text-gray-900 font-bold">Infrastruktur Energi</CardTitle>
                </CardHeader>
                <CardContent className="text-center px-6 pb-8">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Pembangunan infrastruktur kelistrikan untuk daerah terpencil dan program elektrifikasi desa.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-[#1E40AF] font-semibold">
                    <CheckCircle size={16} />
                    <span>Akses Listrik Universal</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:scale-105 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
                <CardHeader className="items-center pb-4 pt-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Leaf className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-center text-gray-900 font-bold">Lingkungan Hidup</CardTitle>
                </CardHeader>
                <CardContent className="text-center px-6 pb-8">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Program konservasi lingkungan, penghijauan, dan pengembangan energi terbarukan.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-green-600 font-semibold">
                    <CheckCircle size={16} />
                    <span>Sustainability Goals</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:scale-105 bg-gradient-to-br from-yellow-50 to-yellow-100 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#FCD34D] to-[#F59E0B]"></div>
                <CardHeader className="items-center pb-4 pt-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FCD34D] to-[#F59E0B] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-[#1E40AF]" />
                  </div>
                  <CardTitle className="text-xl text-center text-gray-900 font-bold">Pemberdayaan Masyarakat</CardTitle>
                </CardHeader>
                <CardContent className="text-center px-6 pb-8">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Program pelatihan keterampilan, UMKM, dan pemberdayaan ekonomi masyarakat lokal.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-[#F59E0B] font-semibold">
                    <CheckCircle size={16} />
                    <span>Economic Empowerment</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:scale-105 bg-gradient-to-br from-red-50 to-red-100 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
                <CardHeader className="items-center pb-4 pt-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-center text-gray-900 font-bold">Sosial Kemanusiaan</CardTitle>
                </CardHeader>
                <CardContent className="text-center px-6 pb-8">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Program kesehatan, pendidikan, dan bantuan kemanusiaan untuk masyarakat yang membutuhkan.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-red-600 font-semibold">
                    <CheckCircle size={16} />
                    <span>Social Impact</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Programs Section - Redesigned */}
        <section className="w-full py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-[#1E40AF]/10 rounded-full mb-6">
                <Building2 className="w-4 h-4 text-[#1E40AF] mr-2" />
                <span className="text-[#1E40AF] font-semibold text-sm">Latest Programs</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Program CSR Terkini
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Program-program CSR PLN yang sedang berjalan dan telah memberikan dampak positif bagi masyarakat Indonesia
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {samplePrograms.map(program => (
                <Card key={program.id} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden bg-white hover:scale-105">
                  <div className="h-2 bg-gradient-to-r from-[#1E40AF] to-[#FCD34D]"></div>
                  <CardHeader className="pb-4 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          program.status === 'SELESAI' ? 'bg-green-500' : 
                          program.status === 'BERJALAN' ? 'bg-[#1E40AF]' : 'bg-yellow-500'
                        }`}></div>
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                          program.status === 'SELESAI' ? 'text-green-700 bg-green-100' : 
                          program.status === 'BERJALAN' ? 'text-[#1E40AF] bg-blue-100' : 'text-yellow-700 bg-yellow-100'
                        }`}>
                          {program.status === 'SELESAI' ? 'Completed' : 
                           program.status === 'BERJALAN' ? 'Ongoing' : program.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[#FCD34D] fill-current" />
                        <span className="text-sm font-semibold text-gray-600">{program.progress}%</span>
                      </div>
                    </div>
                    <CardTitle className="text-xl text-gray-900 group-hover:text-[#1E40AF] transition-colors font-bold leading-tight">
                      {program.judul}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
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
                    
                    <div className="flex items-center gap-2 text-[#1E40AF] font-semibold text-sm">
                      <CheckCircle size={16} />
                      <span>Program Aktif</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <div className="inline-flex items-center px-6 py-3 bg-[#1E40AF]/10 rounded-full">
                <Monitor className="w-5 h-5 text-[#1E40AF] mr-2" />
                <span className="text-[#1E40AF] font-semibold">Program CSR Berkelanjutan</span>
              </div>
            </div>
          </div>
        </section>

        {/* Monitoring Features - Redesigned */}
        <section className="w-full py-20 bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-[#1E40AF]/10 rounded-full mb-6">
                <Globe className="w-4 h-4 text-[#1E40AF] mr-2" />
                <span className="text-[#1E40AF] font-semibold text-sm">Platform Features</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Fitur Monitoring Platform
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Platform monitoring CSR PLN dilengkapi dengan berbagai fitur canggih untuk memastikan 
                transparansi dan akuntabilitas program
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="group bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#1E40AF] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section - Redesigned */}
        <section className="w-full py-20 bg-gradient-to-br from-[#1E40AF] to-[#1E3A8A] relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FCD34D]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#3B82F6]/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="inline-flex items-center px-4 py-2 bg-[#FCD34D]/20 backdrop-blur-sm rounded-full border border-[#FCD34D]/30 mb-8">
                <Monitor className="w-4 h-4 text-[#FCD34D] mr-2" />
                <span className="text-[#FCD34D] font-semibold text-sm">Join Our Platform</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Bergabunglah dalam Transformasi
                <span className="block text-[#FCD34D]">CSR Digital PLN</span>
              </h2>
              
              <p className="text-lg md:text-xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
                Akses platform monitoring CSR PLN untuk transparansi penuh program Corporate Social Responsibility
                dan berkontribusi dalam pembangunan Indonesia berkelanjutan
              </p>
              
              <div className="flex justify-center">
                <Button
                  size="lg"
                  className="bg-[#FCD34D] hover:bg-[#F59E0B] text-[#1E40AF] font-bold px-8 py-4 text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 group"
                  asChild
                >
                  <Link href="/login" className="flex items-center gap-2">
                    <Monitor className="w-5 h-5" />
                    Akses Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Modern Professional Design */}
      <footer className="w-full bg-gradient-to-br from-[#1E40AF] via-[#1E3A8A] to-[#1E40AF] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FCD34D]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#3B82F6]/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Main Footer Content */}
          <div className="py-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Brand Section */}
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
              
              {/* Quick Links */}
              <div className="lg:col-span-1">
                <h3 className="text-white font-bold text-lg mb-6">Navigasi</h3>
                <div className="space-y-4">
                  <Link href="/" className="block text-blue-100 hover:text-[#FCD34D] transition-colors duration-300 text-sm">
                    Beranda
                  </Link>
                  <Link href="/about" className="block text-blue-100 hover:text-[#FCD34D] transition-colors duration-300 text-sm">
                    Tentang TJSL
                  </Link>
                  <Link href="/contact" className="block text-blue-100 hover:text-[#FCD34D] transition-colors duration-300 text-sm">
                    Kontak
                  </Link>
                  <Link href="/login" className="block text-blue-100 hover:text-[#FCD34D] transition-colors duration-300 text-sm">
                    Dashboard
                  </Link>
                </div>
              </div>
              
              {/* Contact Info */}
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
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-[#FCD34D] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-blue-100 text-sm">Monitoring CSR Digital</p>
                      <p className="text-blue-200 text-xs">Transparansi & Akuntabilitas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Footer */}
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