// app/dashboard/insights/layout.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronRight, Home, BarChart3, Brain } from 'lucide-react';

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 sm:px-6 py-3 sm:py-4">
        <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
          <Link
            href="/dashboard"
            className="flex items-center hover:text-blue-600 transition-colors"
          >
            <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span className="hidden sm:inline">Overview</span>
            <span className="sm:hidden">Home</span>
          </Link>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-gray-900 font-medium">
            <span className="hidden sm:inline">Insights & Analytics</span>
            <span className="sm:hidden">Insights</span>
          </span>
        </nav>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-8">
        {/* Modern Header */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-white/20 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">Insights & Analytics</h1>
                <p className="text-blue-100 text-sm sm:text-lg">
                  <span className="hidden sm:inline">Dashboard analitik dan laporan program CSR PLN UIP Kota Makassar</span>
                  <span className="sm:hidden">Dashboard analitik program CSR</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}