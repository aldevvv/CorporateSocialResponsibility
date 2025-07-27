// app/dashboard/components/Header.tsx
'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Bell, Settings, LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { data: session } = useSession();
  const user = session?.user;
  const userInitials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 bg-gradient-to-r from-[#1E40AF] to-[#1E3A8A] backdrop-blur-md border-b border-white/10 px-4 lg:px-6 shadow-lg">
      {/* Left Section - Page Title */}
      <div className="flex items-center gap-4">
        <div className="lg:hidden w-16"></div> {/* Space for mobile menu button */}
        <div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-white hover:text-white hover:bg-white/10">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-[#FCD34D] rounded-full"></span>
          <span className="sr-only">Notifikasi</span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative flex items-center gap-2 p-2 h-auto hover:bg-white/10 rounded-xl text-white">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-blue-100">
                  {(user as { role: string })?.role === 'ADMIN' ? 'Administrator' : 'Pelaksana Program'}
                </p>
              </div>
              <Avatar className="h-9 w-9 ring-2 ring-white/20">
                <AvatarFallback className="bg-gradient-to-br from-white to-blue-100 text-[#1E40AF] font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 p-2" align="end">
            <DropdownMenuLabel className="p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-br from-[#1E40AF] to-[#1E3A8A] text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <p className="text-xs text-[#1E40AF] font-medium">
                    {(user as { role: string })?.role === 'ADMIN' ? 'Administrator' : 'Pelaksana Program'}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="p-3 cursor-pointer hover:bg-gray-50 rounded-lg">
              <Link href="/dashboard/settings" className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Settings className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium">Pengaturan Akun</p>
                  <p className="text-xs text-gray-500">Kelola profil dan preferensi</p>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-3 cursor-pointer hover:bg-red-50 rounded-lg text-red-600"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <LogOut className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Logout</p>
                  <p className="text-xs text-red-500">Keluar dari sistem</p>
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}