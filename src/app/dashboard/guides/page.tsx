// app/dashboard/guides/page.tsx
'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { BookOpenText, Shield, User } from 'lucide-react';

export default function GuidesPage() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role: string })?.role === 'ADMIN';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BookOpenText className="h-8 w-8 text-[#1E40AF]" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pusat Bantuan & Panduan</h1>
          <p className="text-gray-600">Panduan lengkap penggunaan sistem PLN UIP Kota Makassar</p>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Guide - Always visible */}
        <Link href="/dashboard/guides/user">
          <Card className="hover:bg-gray-50 transition-colors border-l-4 border-l-green-500 h-full">
            <CardHeader className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Pelaksana Program
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-xl text-gray-900">Panduan untuk User (Pelaksana)</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                Panduan lengkap untuk pelaksana program CSR, termasuk cara melaporkan progres program, 
                mengelola dokumen, dan menggunakan fitur-fitur yang tersedia di lapangan.
              </CardDescription>
              <div className="mt-4 text-sm text-green-600 font-medium">
                Klik untuk membaca panduan →
              </div>
            </CardHeader>
          </Card>
        </Link>

        {/* Admin Guide - Only visible to admins */}
        {isAdmin && (
          <Link href="/dashboard/guides/admin">
            <Card className="hover:bg-gray-50 transition-colors border-l-4 border-l-[#1E40AF] h-full">
              <CardHeader className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Shield className="h-5 w-5 text-[#1E40AF]" />
                    </div>
                    <Badge variant="default" className="bg-[#1E40AF] text-white">
                      Administrator
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-xl text-gray-900">Panduan untuk Admin</CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Panduan komprehensif untuk administrator sistem, mencakup alur kerja lengkap dari 
                  manajemen proposal, program, pelaporan, hingga analisis data dan manajemen pengguna.
                </CardDescription>
                <div className="mt-4 text-sm text-[#1E40AF] font-medium">
                  Klik untuk membaca panduan →
                </div>
              </CardHeader>
            </Card>
          </Link>
        )}

        {/* Info Card for Regular Users */}
        {!isAdmin && (
          <Card className="border-dashed border-2 border-gray-300 bg-gray-50/50">
            <CardHeader className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gray-200 rounded-full">
                  <Shield className="h-6 w-6 text-gray-500" />
                </div>
              </div>
              <CardTitle className="text-lg text-gray-600">Panduan Administrator</CardTitle>
              <CardDescription className="text-gray-500">
                Panduan ini hanya tersedia untuk pengguna dengan role Administrator. 
                Hubungi admin sistem jika Anda memerlukan akses tambahan.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <BookOpenText className="h-5 w-5 text-[#1E40AF] mt-0.5" />
          <div>
            <h3 className="font-semibold text-[#1E40AF] mb-2">Informasi Panduan</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Panduan ini disusun untuk membantu Anda menggunakan sistem monitoring CSR PLN UIP Kota Makassar 
              dengan optimal. Setiap panduan disesuaikan dengan peran dan tanggung jawab pengguna dalam sistem.
            </p>
            {!isAdmin && (
              <p className="text-sm text-gray-600 mt-2">
                <strong>Catatan:</strong> Sebagai pelaksana program, Anda memiliki akses ke panduan yang relevan 
                dengan tugas dan fungsi Anda dalam sistem.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}