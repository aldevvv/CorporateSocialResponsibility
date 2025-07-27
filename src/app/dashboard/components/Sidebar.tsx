// app/dashboard/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  FileText,
  LayoutDashboard,
  Rocket,
  User,
  ClipboardList,
  Upload,
  BarChartBig,
  Menu,
  X,
  BookOpenText,
  Users,
  Settings
} from 'lucide-react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import Image from 'next/image';

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [userProgramId, setUserProgramId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoadingProgram, setIsLoadingProgram] = useState(false);

  // Memoize user data to prevent unnecessary re-renders
  const user = useMemo(() => session?.user as { role: string; id: string } | undefined, [session?.user]);

  // Optimized fetch user's program ID for USER role - with timeout and fallback
  useEffect(() => {
    if (status === 'loading') return; // Wait for session to load
    
    if (user?.role === 'USER' && user?.id && !userProgramId && !isLoadingProgram) {
      setIsLoadingProgram(true);
      
      const controller = new AbortController();
      
      // Set timeout for API call (5 seconds max)
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.warn('API call timeout - using fallback menu');
        setIsLoadingProgram(false);
      }, 5000);
      
      fetch(`/api/user-program/${user.id}`, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'max-age=300' // Cache for 5 minutes
        }
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch program');
          return res.json();
        })
        .then(data => {
          clearTimeout(timeoutId);
          if (data.programId) {
            setUserProgramId(data.programId);
          }
        })
        .catch(err => {
          clearTimeout(timeoutId);
          if (err.name !== 'AbortError') {
            console.error('Error fetching user program:', err);
          }
        })
        .finally(() => {
          setIsLoadingProgram(false);
        });

      return () => {
        controller.abort();
        clearTimeout(timeoutId);
      };
    }
  }, [user?.role, user?.id, userProgramId, isLoadingProgram, status]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Show all menus immediately - don't wait for session loading
  const menuItems = useMemo(() => {
    // Default menu items - show immediately
    const defaultMenuItems = [
      {
        name: 'Program Saya',
        href: '/dashboard/my-programs',
        icon: User,
        description: 'Program yang saya kelola'
      },
      {
        name: 'Riwayat Laporan',
        href: userProgramId ? `/dashboard/programs/${userProgramId}/reports` : '/dashboard/reports',
        icon: ClipboardList,
        description: 'Laporan yang telah dibuat'
      },
      {
        name: 'Buat Laporan',
        href: userProgramId ? `/dashboard/programs/${userProgramId}/create-report` : '/dashboard/create-report',
        icon: FileText,
        description: 'Buat laporan baru'
      },
      {
        name: 'Manajemen Dokumen',
        href: userProgramId ? `/dashboard/programs/${userProgramId}/documents` : '/dashboard/documents',
        icon: Upload,
        description: 'Kelola dokumen program'
      },
      {
        name: 'Panduan',
        href: '/dashboard/guides',
        icon: BookOpenText,
        description: 'Panduan penggunaan sistem'
      }
    ];

    // Admin-only menu items
    const adminMenuItems = [
      {
        name: 'Overview',
        href: '/dashboard/overview',
        icon: LayoutDashboard,
        description: 'Ringkasan data'
      },
      {
        name: 'Manajemen Proposal',
        href: '/dashboard/proposals',
        icon: FileText,
        description: 'Kelola proposal CSR'
      },
      {
        name: 'Program Berjalan',
        href: '/dashboard/programs',
        icon: Rocket,
        description: 'Monitor program aktif'
      },
      {
        name: 'Insights',
        href: '/dashboard/insights',
        icon: BarChartBig,
        description: 'Analitik & laporan'
      },
      {
        name: 'Users',
        href: '/dashboard/users',
        icon: Users,
        description: 'Kelola pengguna sistem'
      },
      {
        name: 'AI Settings',
        href: '/dashboard/ai-settings',
        icon: Settings,
        description: 'Kelola API Key & Prompt AI'
      },
      {
        name: 'Panduan',
        href: '/dashboard/guides',
        icon: BookOpenText,
        description: 'Panduan penggunaan sistem'
      }
    ];

    // Show appropriate menu based on role, or default menu if still loading
    if (status === 'loading' || !user?.role) {
      return defaultMenuItems; // Show default menu while loading
    }
    
    if (user.role === 'ADMIN') {
      return adminMenuItems;
    } else if (user.role === 'USER') {
      return defaultMenuItems.filter(item => item.name !== 'Dashboard'); // Remove Dashboard for USER
    }

    return defaultMenuItems;
  }, [user?.role, userProgramId, status]);

  // Memoized mobile menu toggle
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  // Memoized SidebarContent to prevent unnecessary re-renders
  const SidebarContent = useMemo(() => (
    <>
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 bg-white rounded-lg flex items-center justify-center p-1">
            <Image
              src="/PLN.png"
              alt="PLN Logo"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">SIM CSR</h1>
            <p className="text-xs text-blue-100">PLN UIP Kota Makassar</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-white/10 hover:backdrop-blur-sm
                ${isActive
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20'
                  : 'text-blue-100 hover:text-white'
                }
              `}
            >
              <div className={`p-1.5 rounded-md transition-colors ${
                isActive
                  ? 'bg-white/20'
                  : 'bg-white/10 group-hover:bg-white/20'
              }`}>
                <IconComponent className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">
                  {item.name}
                </p>
                {'description' in item && item.description && (
                  <p className="text-xs text-blue-200 mt-0.5 truncate opacity-80">
                    {item.description}
                  </p>
                )}
              </div>
              {isActive && (
                <div className="w-2 h-2 bg-[#FCD34D] rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <div className="text-center">
          <p className="text-xs text-blue-200">
            © 2024 PLN UIP Kota Makassar
          </p>
          <p className="text-xs text-blue-300 mt-0.5">
            Sistem Monitoring CSR
          </p>
        </div>
      </div>
    </>
  ), [menuItems, pathname, status]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1E40AF] text-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-[#1E40AF] to-[#1E3A8A] flex-col shadow-2xl">
        {SidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-[#1E40AF] to-[#1E3A8A] flex-col shadow-2xl z-40 transform transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {SidebarContent}
      </aside>
    </>
  );
}