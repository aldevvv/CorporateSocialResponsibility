// app/login/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicNavbar } from '@/components/PublicNavbar';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError('Email atau password salah.');
      setIsLoading(false);
    } else {
      router.push('/dashboard'); // Arahkan ke dashboard setelah login berhasil
    }
  };

  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen bg-gradient-to-br from-[#1E40AF] via-[#1E3A8A] to-[#1E40AF] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1E40AF]/20 via-transparent to-[#FCD34D]/10"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-20 right-20 w-96 h-96 bg-[#FCD34D] rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#3B82F6] rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FCD34D] rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md">
            <CardHeader className="text-center pb-6 pt-8">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="relative w-20 h-20 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-2xl p-3 shadow-lg">
                  <Image
                    src="/PLN.png"
                    alt="PLN Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              
              <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Masuk ke Dashboard
              </CardTitle>
              <p className="text-gray-600 text-sm">
                Sistem Monitoring CSR PLN UIP Kota Makassar
              </p>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Masukkan email Anda"
                      className="pl-10 h-12 border-gray-300 focus:border-[#1E40AF] focus:ring-[#1E40AF] rounded-xl"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password Anda"
                      className="pl-10 pr-10 h-12 border-gray-300 focus:border-[#1E40AF] focus:ring-[#1E40AF] rounded-xl"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LogIn className="w-5 h-5" />
                      <span>Masuk Dashboard</span>
                    </div>
                  )}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-[#FCD34D]/10 rounded-xl">
                <div className="flex items-center gap-2 text-[#1E40AF] font-semibold text-sm mb-3">
                  <CheckCircle className="w-4 h-4" />
                  <span>Demo Credentials</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Admin:</span>
                    <span className="font-mono bg-white px-2 py-1 rounded text-gray-800">admin@pln.co.id</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">User:</span>
                    <span className="font-mono bg-white px-2 py-1 rounded text-gray-800">user@pln.co.id</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Password:</span>
                    <span className="font-mono bg-white px-2 py-1 rounded text-gray-800">password123</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="text-center mt-6">
            <p className="text-white/80 text-sm">
              © {new Date().getFullYear()} PT PLN (Persero) - CSR Monitoring Platform
            </p>
            <p className="text-white/60 text-xs mt-1">
              Sistem Informasi Monitoring Program CSR Indonesia
            </p>
          </div>
        </div>
      </div>
    </>
  );
}