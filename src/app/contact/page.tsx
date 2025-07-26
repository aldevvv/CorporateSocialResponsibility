// app/contact/page.tsx
import { PublicNavbar } from '@/components/PublicNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MapPin,
  Phone,
  Mail,
  Clock,
  Building2,
  Users,
  MessageSquare,
  Send,
  CheckCircle,
  Globe,
  FileText
} from 'lucide-react';
import Image from 'next/image';

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Building2,
      title: "Kantor Pusat",
      details: [
        "PT PLN (Persero)",
        "Unit Induk Pembangunan Kota Makassar",
        "Jl. Urip Sumoharjo No. 15",
        "Makassar, Sulawesi Selatan 90234"
      ],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Phone,
      title: "Telepon",
      details: [
        "+62 411 456789",
        "+62 411 456790",
        "Senin - Jumat: 08:00 - 17:00 WITA",
        "Sabtu: 08:00 - 12:00 WITA"
      ],
      color: "from-green-500 to-green-600"
    },
    {
      icon: Mail,
      title: "Email",
      details: [
        "csr@plnuipmakassar.co.id",
        "info@plnuipmakassar.co.id",
        "tjsl@plnuipmakassar.co.id",
        "Response time: 1x24 jam"
      ],
      color: "from-yellow-500 to-yellow-600"
    },
    {
      icon: FileText,
      title: "Fax & Lainnya",
      details: [
        "Fax: +62 411 456791",
        "WhatsApp: +62 812 3456 7890",
        "Website: www.pln.co.id",
        "Social Media: @PLNMakassar"
      ],
      color: "from-purple-500 to-purple-600"
    }
  ];

  const departments = [
    {
      name: "Divisi TJSL & CSR",
      head: "Ir. Ahmad Syahrul, M.T.",
      phone: "+62 411 456792",
      email: "tjsl@plnuipmakassar.co.id",
      description: "Menangani program Tanggung Jawab Sosial dan Lingkungan serta Corporate Social Responsibility"
    },
    {
      name: "Divisi Komunikasi & Humas",
      head: "Dra. Siti Nurhaliza, M.Kom.",
      phone: "+62 411 456793",
      email: "humas@plnuipmakassar.co.id",
      description: "Menangani komunikasi publik, media relations, dan informasi perusahaan"
    },
    {
      name: "Divisi Kemitraan",
      head: "Dr. Muhammad Ridwan, S.E., M.M.",
      phone: "+62 411 456794",
      email: "kemitraan@plnuipmakassar.co.id",
      description: "Menangani kerjasama dengan mitra dan stakeholder program CSR"
    }
  ];

  const officeHours = [
    { day: "Senin - Kamis", hours: "08:00 - 17:00 WITA" },
    { day: "Jumat", hours: "08:00 - 17:00 WITA" },
    { day: "Sabtu", hours: "08:00 - 12:00 WITA" },
    { day: "Minggu", hours: "Tutup" }
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
                <MessageSquare className="w-4 h-4 text-[#FCD34D] mr-2" />
                <span className="text-[#FCD34D] font-semibold text-sm">Hubungi Kami</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Kontak
              </h1>
              
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto">
                Hubungi tim TJSL PLN UIP Kota Makassar untuk informasi program CSR, kemitraan, atau pertanyaan lainnya
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="w-full py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-[#1E40AF]/10 rounded-full mb-6">
                <Phone className="w-4 h-4 text-[#1E40AF] mr-2" />
                <span className="text-[#1E40AF] font-semibold text-sm">Informasi Kontak</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Informasi Kontak
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Berbagai cara untuk menghubungi tim PLN UIP Kota Makassar
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {contactInfo.map((contact, index) => {
                const IconComponent = contact.icon;
                return (
                  <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:scale-105 bg-white text-center">
                    <CardHeader className="items-center pb-4 pt-8">
                      <div className={`w-16 h-16 bg-gradient-to-br ${contact.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl text-center text-gray-900 font-bold">
                        {contact.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-8">
                      <div className="space-y-2">
                        {contact.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-600 text-sm leading-relaxed">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Departments */}
        <section className="w-full py-20 bg-gradient-to-br from-[#1E40AF]/5 to-[#FCD34D]/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-[#1E40AF]/10 rounded-full mb-6">
                <Users className="w-4 h-4 text-[#1E40AF] mr-2" />
                <span className="text-[#1E40AF] font-semibold text-sm">Divisi Terkait</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Divisi Terkait TJSL
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Tim yang menangani program TJSL dan CSR PLN UIP Kota Makassar
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {departments.map((dept, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:scale-105 bg-white">
                  <div className="h-1 bg-gradient-to-r from-[#1E40AF] to-[#FCD34D]"></div>
                  <CardHeader className="pb-4 pt-6">
                    <CardTitle className="text-xl text-gray-900 group-hover:text-[#1E40AF] transition-colors font-bold leading-tight">
                      {dept.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 mb-1">Kepala Divisi:</div>
                        <div className="text-sm text-gray-600">{dept.head}</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-[#1E40AF]" />
                          <span className="text-sm text-gray-600">{dept.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-[#1E40AF]" />
                          <span className="text-sm text-gray-600">{dept.email}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {dept.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-[#1E40AF] font-semibold text-sm">
                        <CheckCircle size={16} />
                        <span>Siap Melayani</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Office Hours & Location */}
        <section className="w-full py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Office Hours */}
                <div>
                  <div className="inline-flex items-center px-4 py-2 bg-[#1E40AF]/10 rounded-full mb-6">
                    <Clock className="w-4 h-4 text-[#1E40AF] mr-2" />
                    <span className="text-[#1E40AF] font-semibold text-sm">Jam Operasional</span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                    Jam Operasional
                  </h3>
                  
                  <Card className="shadow-lg border-0">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {officeHours.map((schedule, index) => (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                            <span className="font-semibold text-gray-900">{schedule.day}</span>
                            <span className={`font-medium ${schedule.hours === 'Tutup' ? 'text-red-500' : 'text-[#1E40AF]'}`}>
                              {schedule.hours}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 p-4 bg-[#1E40AF]/5 rounded-xl">
                        <div className="flex items-center gap-2 text-[#1E40AF] font-semibold text-sm mb-2">
                          <CheckCircle size={16} />
                          <span>Catatan Penting</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Untuk kunjungan terkait program TJSL, disarankan membuat janji terlebih dahulu melalui telepon atau email.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Location Map Placeholder */}
                <div>
                  <div className="inline-flex items-center px-4 py-2 bg-[#1E40AF]/10 rounded-full mb-6">
                    <MapPin className="w-4 h-4 text-[#1E40AF] mr-2" />
                    <span className="text-[#1E40AF] font-semibold text-sm">Lokasi Kantor</span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                    Lokasi Kantor
                  </h3>
                  
                  <Card className="shadow-lg border-0 overflow-hidden">
                    <div className="h-64 bg-gradient-to-br from-[#1E40AF]/10 to-[#FCD34D]/10 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-16 h-16 text-[#1E40AF] mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-gray-900 mb-2">PLN UIP Kota Makassar</h4>
                        <p className="text-gray-600 text-sm">Jl. Urip Sumoharjo No. 15</p>
                        <p className="text-gray-600 text-sm">Makassar, Sulawesi Selatan 90234</p>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Building2 size={16} className="text-[#1E40AF]" />
                          <span className="text-gray-600 text-sm">Gedung PLN UIP Makassar, Lantai 3</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin size={16} className="text-[#1E40AF]" />
                          <span className="text-gray-600 text-sm">Dekat dengan Mal Panakkukang</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Globe size={16} className="text-[#1E40AF]" />
                          <span className="text-gray-600 text-sm">Akses mudah transportasi umum</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="w-full py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-[#1E40AF]/10 rounded-full mb-6">
                <Send className="w-4 h-4 text-[#1E40AF] mr-2" />
                <span className="text-[#1E40AF] font-semibold text-sm">Kirim Pesan</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Kirim Pesan Kepada Kami
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Untuk pertanyaan lebih lanjut tentang program TJSL atau kemitraan, silakan hubungi kami melalui informasi kontak di atas
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-2xl border-0 bg-white">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <MessageSquare className="w-10 h-10 text-[#FCD34D]" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Hubungi Tim TJSL Kami
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-8">
                      Tim TJSL PLN UIP Kota Makassar siap membantu Anda dengan informasi program CSR, 
                      peluang kemitraan, dan pertanyaan lainnya terkait tanggung jawab sosial perusahaan.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 bg-[#1E40AF]/5 rounded-xl">
                        <Phone className="w-8 h-8 text-[#1E40AF] mx-auto mb-3" />
                        <div className="font-semibold text-gray-900 mb-1">Telepon</div>
                        <div className="text-sm text-gray-600">+62 411 456789</div>
                      </div>
                      
                      <div className="text-center p-4 bg-[#1E40AF]/5 rounded-xl">
                        <Mail className="w-8 h-8 text-[#1E40AF] mx-auto mb-3" />
                        <div className="font-semibold text-gray-900 mb-1">Email</div>
                        <div className="text-sm text-gray-600">csr@plnuipmakassar.co.id</div>
                      </div>
                      
                      <div className="text-center p-4 bg-[#1E40AF]/5 rounded-xl">
                        <Clock className="w-8 h-8 text-[#1E40AF] mx-auto mb-3" />
                        <div className="font-semibold text-gray-900 mb-1">Jam Kerja</div>
                        <div className="text-sm text-gray-600">08:00 - 17:00 WITA</div>
                      </div>
                    </div>
                    
                    <div className="mt-8 p-4 bg-[#FCD34D]/10 rounded-xl">
                      <div className="flex items-center justify-center gap-2 text-[#1E40AF] font-semibold mb-2">
                        <CheckCircle size={16} />
                        <span>Response Time: 1x24 Jam</span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Kami berkomitmen memberikan respon terbaik untuk setiap pertanyaan Anda
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                  <a href="/" className="block text-blue-100 hover:text-[#FCD34D] transition-colors duration-300 text-sm">
                    Beranda
                  </a>
                  <a href="/programs" className="block text-blue-100 hover:text-[#FCD34D] transition-colors duration-300 text-sm">
                    Program Kami
                  </a>
                  <a href="/about" className="block text-blue-100 hover:text-[#FCD34D] transition-colors duration-300 text-sm">
                    Tentang TJSL
                  </a>
                  <a href="/contact" className="block text-blue-100 hover:text-[#FCD34D] transition-colors duration-300 text-sm">
                    Kontak
                  </a>
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